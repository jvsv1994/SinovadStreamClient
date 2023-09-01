import { Component, Input, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/modules/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { SeasonFormPage } from '../season-form/season-form.page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { TvSerie } from '../../../tvseries/models/tvserie.model';
import { SeasonService } from '../../services/season.service';
import { Season } from '../../models/season.model';
import { EpisodeListModalPage } from '../../../episodes/components/episode-list-modal/episode-list-modal.page';
@Component({
  selector: 'app-season-list',
  templateUrl: 'season-list.page.html',
  styleUrls: ['season-list.page.scss'],
})
export class SeasonListPage extends CustomListGeneric<Season>{

  @Input() parentItem:TvSerie;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private modalService: NgbModal,
    private dialog: MatDialog,
    private seasonService:SeasonService,
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
      this.sortBy="SeasonNumber";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.sort.sort({
        id:"SeasonNumber",
        start:"asc",
        disableClear:true
      });
      this.searchBy="SeasonNumber";
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
      var season= new Season();
      this.showModalForm(season);
    }

    public editItem(season: Season){
      this.showModalForm(season);
    }

    public showModalForm(season:Season){
      var ctx=this;
      var ref=this.modalService.open(SeasonFormPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.season=season;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.seasonService.getItems(this.parentItem.Id,this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

       public deleteItem(item:Season){
        var config = new MatDialogConfig<ConfirmDialogOptions>();
        config.data={
          title:'Eliminar Temporada',message:'¿Esta seguro que desea eliminar la temporada '+item.Name+'?',accordMessage:"Si, eliminar la temporada '"+item.Name+"'"
        }
        this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
          if (confirm) {
            this.executeDeleteItem(item);
          }
        });
      }

      private executeDeleteItem(item:Season){
        this.showLoading=true;
        this.seasonService.deleteItem(item.Id).then(res=>{
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
            title:"Eliminar seasons",message:'¿Esta seguro que desea eliminar los registros seleccionados?',accordMessage:"Si, eliminar"
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
        this.seasonService.deleteItems(this.selection.selected).then(res=>{
          this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
          this.getAllItems();
        },(error)=>{
          this.showLoading=false;
          this.snackbarService.showSnackBar(error,SnackBarType.Error);
        });
      }

      //Displayed Columns Section

      public getDisplayedColumns(){
          return ['Select','SeasonNumber', 'Name','Actions'];
      }


      //episodes modal section

      public showEpisodeListModal(season:Season){
        var ctx=this;
        var ref=this.modalService.open(EpisodeListModalPage, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-xl modal-dialog-centered modal-dialog-scrollable  modal-list',scrollable:true,backdrop: 'static'});
        ref.componentInstance.parent=season;
        ref.closed.subscribe(x=>{

        })
      }

}
