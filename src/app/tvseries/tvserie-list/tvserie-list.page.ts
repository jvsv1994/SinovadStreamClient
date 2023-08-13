
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { TvSerieService } from '../shared/tvserie.service';
import { TvSerie } from '../shared/tvserie.model';
import { TvSerieFormPage } from '../tvserie-form/tvserie-form.page';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { SeasonListModalPage } from 'src/app/seasons/season-list-modal/season-list-modal.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tvserie-list',
  templateUrl: './tvserie-list.page.html',
  styleUrls: ['./tvserie-list.page.scss']
})
export class TvSerieListPage extends CustomListGeneric<TvSerie> implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router:Router,
    private modalService: NgbModal,
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private tvserieService:TvSerieService) {
      super(matPaginatorIntl);
    }

    ngOnInit(): void {
      if(!localStorage.getItem('apiToken'))
      {
        this.router.navigateByUrl('/landing');
      }
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
      this.sortBy="Name";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.sort.sort({
        id:"Name",
        start:"asc",
        disableClear:true
      });
      this.searchBy="Name";
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
      var tvserie= new TvSerie();
      this.showModalForm(tvserie);
    }

    public editItem(tvserie: TvSerie){
      this.showModalForm(tvserie);
    }


    public showModalForm(tvserie:TvSerie){
      var ctx=this;
      var ref=this.modalService.open(TvSerieFormPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.tvserie=tvserie;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }


    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.tvserieService.getItems(this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

    public deleteItem(tvserie:TvSerie){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar la serie '+tvserie.Name+'?',accordMessage:"Si, eliminar la serie '"+tvserie.Name+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteItem(tvserie);
        }
      });
    }

    private executeDeleteItem(tvserie:TvSerie){
      this.showLoading=true;
      this.tvserieService.deleteItem(tvserie.Id).then(res=>{
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
      this.tvserieService.deleteItems(this.selection.selected).then(res=>{
        this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }

    //Displayed Columns Section

    public getDisplayedColumns(){
      if(window.innerWidth>1100)
      {
        return ['Select','Id', 'Name', 'FirstAirDate','LastAirDate', 'Actors', 'Directors','Actions'];
      }else if(window.innerWidth>975)
      {
        return ['Select','Id', 'Name', 'FirstAirDate','LastAirDate', 'Actors','Actions'];
      }else if(window.innerWidth>875){
        return ['Select','Id', 'Name', 'FirstAirDate', 'Actors','Actions'];
      }else if(window.innerWidth>495){
        return ['Select','Id', 'Name', 'FirstAirDate','Actions'];
      }else{
        return ['Select','Id', 'Name','Actions'];
      }
    }

    //Seasons modal section

    public showSeasonListModal(tvserie:TvSerie){
      var ctx=this;
      var ref=this.modalService.open(SeasonListModalPage, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-xl modal-dialog-centered modal-dialog-scrollable  modal-list',scrollable:true,backdrop: 'static'});
      ref.componentInstance.parent=tvserie;
      ref.closed.subscribe(x=>{

      })
    }

}
