
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MovieService } from '../shared/movie.service';
import { Movie } from '../shared/movie.model';
import { MovieFormPage } from '../movie-form/movie-form.page';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.page.html',
  styleUrls: ['./movie-list.page.scss']
})
export class MovieListPage extends CustomListGeneric<Movie> implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private movieService:MovieService) {
      super(matPaginatorIntl);
    }

    ngAfterViewInit() {
      //Initialize Paginator
      this.paginator.page.subscribe((event:PageEvent) => {
          this.updatePageData(event);
          this.getAllItems();
        }
      );
      this.dataSource.paginator = this.paginator;

      //Initialize Sort
      this.sort.sortChange.subscribe((sort:Sort) => {
        this.currentPage=1;
        this.sortBy=sort.active;
        this.sortDirection=sort.direction;
        this.getAllItems();
      });
      this.sortBy="Title";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.sort.sort({
        id:"Title",
        start:"asc",
        disableClear:true
      });
      this.searchBy="Title";
      this.dataSource.sort = this.sort;
    }


    //Apply Filters Section

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchText=filterValue.trim().toLowerCase();
      this.currentPage=1;
      this.getAllItems();
    }

    //Show Modal Form Section

    public showNewItem(){
      var movie= new Movie();
      this.showModalForm(movie);
    }

    public editItem(movie: Movie){
      this.showModalForm(movie);
    }


    public showModalForm(movie:Movie){
      var ctx=this;
      var ref=this.modalService.open(MovieFormPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.movie=movie;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }


    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.movieService.getItems(this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
        this.showLoading=false;
        var data=response.Data;
        this.totalCount=response.TotalCount;
        this.listItems=data;
        this.dataSource = new MatTableDataSource(this.listItems);
        this.selection.clear();
        this.paginator.length=this.totalCount;
        this.paginator.pageIndex=this.currentPage-1;
        this.paginator.pageSize=this.itemsPerPage;
      },error=>{
        this.showLoading=false;
      });
    }


    //Delete Section

    public deleteItem(movie:Movie){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el movie '+movie.Title+'?',accordMessage:"Si, eliminar el movie '"+movie.Title+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteItem(movie);
        }
      });
    }

    private executeDeleteItem(movie:Movie){
      this.showLoading=true;
      this.movieService.deleteItem(movie.Id).then(res=>{
        this.snackbarService.showSnackBar("Se elimino el registro satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }

    //Delete List Section

    public deleteSelectedItems(){
      if(this.selection.hasValue())
      {
        var config = new MatDialogConfig<ConfirmDialogOptions>();
        config.data={
          title:"Eliminar películas",message:'¿Esta seguro que desea eliminar los registros seleccionados?',accordMessage:"Si, eliminar"
        }
        this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
          if (confirm) {
            this.executeDeleteSelectedItems();
          }
        });
      }
    }

    private executeDeleteSelectedItems(){
      this.showLoading=true;
      this.movieService.deleteItems(this.selection.selected).then(res=>{
        this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }

    //Displayed Columns Section

    public getDisplayedColumns(){
      if(window.innerWidth>975)
      {
        return ['Select','Id', 'Title', 'ReleaseDate', 'Actors', 'Directors','Actions'];
      }else if(window.innerWidth>875){
        return ['Select','Id', 'Title', 'ReleaseDate', 'Actors','Actions'];
      }else if(window.innerWidth>495){
        return ['Select','Id', 'Title', 'ReleaseDate','Actions'];
      }else{
        return ['Select','Id', 'Title','Actions'];
      }
    }

}
