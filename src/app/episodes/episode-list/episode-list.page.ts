import { Component, Input, ViewChild } from '@angular/core';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { Episode } from '../shared/episode.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { EpisodeService } from '../shared/episode.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { EpisodeFormPage } from '../episode-form/episode-form.page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Season } from 'src/app/seasons/shared/season.model';
@Component({
  selector: 'app-episode-list',
  templateUrl: 'episode-list.page.html',
  styleUrls: ['episode-list.page.scss'],
})
export class EpisodeListPage extends CustomListGeneric<Episode>{

  @Input() parentItem:Season;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private dialog: MatDialog,
    private episodeService:EpisodeService,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService) {
      super(matPaginatorIntl)

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
      this.sortBy="EpisodeNumber";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.sort.sort({
        id:"EpisodeNumber",
        start:"asc",
        disableClear:true
      });
      this.searchBy="EpisodeNumber";
      this.dataSource.sort = this.sort;
    }

    //Apply Filters Section

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchText=filterValue.trim().toLowerCase();
      this.currentPage=1;
      this.getAllItems();
    }

     //Show Modal Section

     public showNewItem(){
      var episode= new Episode();
      this.showModalForm(episode);
    }

    public editItem(episode: Episode){
      this.showModalForm(episode);
    }

    public showModalForm(episode:Episode){
      var ctx=this;
      var ref=this.modalService.open(EpisodeFormPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.episode=episode;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.episodeService.getItems(this.parentItem.Id,this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
        this.showLoading=false;
        var data=response.Data;
        this.totalCount=response.TotalCount;
        this.listItems=data;
        this.dataSource = new MatTableDataSource(data);
        this.selection.clear();
        this.paginator.length=this.totalCount;
        this.paginator.pageIndex=this.currentPage-1;
        this.paginator.pageSize=this.itemsPerPage;
      },error=>{
        this.showLoading=false;
      });
    }

       //Delete Section

       public deleteItem(item:Episode){
        var config = new MatDialogConfig<ConfirmDialogOptions>();
        config.data={
          title:'Eliminar Episodio',message:'¿Esta seguro que desea eliminar el episodio '+item.Name+'?',accordMessage:"Si, eliminar el episodio '"+item.Name+"'"
        }
        this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
          if (confirm) {
            this.executeDeleteItem(item);
          }
        });
      }

      private executeDeleteItem(item:Episode){
        this.showLoading=true;
        this.episodeService.deleteItem(item.Id).then(res=>{
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
            title:"Eliminar episodios",message:'¿Esta seguro que desea eliminar los registros seleccionados?',accordMessage:"Si, eliminar"
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
        this.episodeService.deleteItems(this.selection.selected).then(res=>{
          this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
          this.getAllItems();
        },(error)=>{
          this.showLoading=false;
          this.snackbarService.showSnackBar(error,SnackBarType.Error);
        });
      }

      //Displayed Columns Section

      public getDisplayedColumns(){
          return ['Select','EpisodeNumber', 'Title','Actions'];
      }


}
