import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/users/shared/user.model';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { MediaServer } from '../shared/media-server.model';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MediaServerService } from '../shared/media-server.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
@Component({
  selector: 'app-media-server-list',
  templateUrl: 'media-server-list.page.html',
  styleUrls: ['media-server-list.page.scss'],
})
export class MediaServerListPage extends CustomListGeneric<MediaServer> implements OnInit{

  @Input() parentItem:User;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private mediaServerService:MediaServerService,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService) {
      super(matPaginatorIntl)

    }

    public ngOnInit(): void {
      this.refreshSubscription$=this.mediaServerService.refreshListEvent.subscribe(event=>{
        this.getAllItems();
      });
    }

    public ngOnDestroy(): void {
      this.refreshSubscription$.unsubscribe();
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
      this.sortBy="IpAddress";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.sort.sort({
        id:"IpAddress",
        start:"asc",
        disableClear:true
      });
      this.searchBy="IpAddress|Port|FamilyName|DeviceName";
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
      var item= new MediaServer();
      this.mediaServerService.showModal(item);
    }

    public editItem(item: MediaServer){
      this.mediaServerService.showModal(item);
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.mediaServerService.getItems(this.parentItem.Id,this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

       public deleteItem(item:MediaServer){
        var config = new MatDialogConfig<ConfirmDialogOptions>();
        config.data={
          title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el servidor '+item.DeviceName+'?',accordMessage:"Si, eliminar el servidor '"+item.DeviceName+"'"
        }
        this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
          if (confirm) {
            this.executeDeleteItem(item);
          }
        });
      }

      private executeDeleteItem(item:MediaServer){
        this.showLoading=true;
        this.mediaServerService.deleteItem(item.Id).then(res=>{
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
            title:"Eliminar roles",message:'¿Esta seguro que desea eliminar los registros seleccionados?',accordMessage:"Si, eliminar"
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
        this.mediaServerService.deleteItems(this.selection.selected).then(res=>{
          this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
          this.getAllItems();
        },(error)=>{
          this.showLoading=false;
          this.snackbarService.showSnackBar(error,SnackBarType.Error);
        });
      }

      //Displayed Columns Section

      public getDisplayedColumns(){
        if(window.innerWidth>600)
        {
          return ['Id', 'DeviceName','FamilyName','IpAddress','Port'];
        }else if(window.innerWidth>475){
          return ['Id', 'DeviceName','FamilyName'];
        }{
          return ['Id', 'DeviceName'];
        }
      }

}
