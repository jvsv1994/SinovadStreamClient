
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { Role } from '../shared/role.model';
import { RoleService } from '../shared/role.service';
import { Subscription } from 'rxjs';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SnackBarService } from 'src/app/shared/services/toast.service';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.page.html',
  styleUrls: ['./role-list.page.scss']
})
export class RoleListPage extends CustomListGeneric<Role>  implements OnInit,OnDestroy,AfterViewInit {

  showContextMenu:boolean=false;
  refreshSubscription$:Subscription;
  showLoading:boolean=true;
  displayedColumns: string[] = ['Select','Id', 'Name','Actions'];
  dataSource=new MatTableDataSource<Role>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private roleService:RoleService,
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(matPaginatorIntl);
    }

    public ngOnInit(): void {
      this.refreshSubscription$=this.roleService.refreshListEvent.subscribe(event=>{
        this.getAllItems();
      });
      this.getAllItems();
    }

    ngAfterViewInit() {
    }

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    public ngOnDestroy(): void {
      this.refreshSubscription$.unsubscribe();
    }

    public onChangePaginator(event:PageEvent){
      this.updatePageData(event);
      this.getAllItems();
    }

    //Show Modal Section

    public showNewItem(){
      var role= new Role();
      role.Enabled=true;
      this.roleService.showModal(role);
    }

    public editItem(role: Role){
      this.roleService.showModal(role);
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.roleService.getItems(this.currentPage,this.itemsPerPage).then((response:SinovadApiPaginationResponse) => {
        var data=response.Data;
        this.totalCount=response.TotalCount;
        this.listItems=data;
        this.dataSource = new MatTableDataSource(this.listItems);
        this.listSelectedItems=[];
        this.showLoading=false;
        this.ref.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },error=>{
        this.showLoading=false;
      });
    }


    //Delete Section

    public deleteItem(role:Role){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el rol '+role.Name+'?',accordMessage:"Si, eliminar el rol '"+role.Name+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteItem(role);
        }
      });
    }

    private executeDeleteItem(role:Role){
      this.showLoading=true;
      this.roleService.deleteItem(role.Id).then(res=>{
        this.snackbarService.showSnackBar("Se elimino el registro satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }

    //Delete List Section

    public deleteSelectedItems(){
      if(this.listSelectedItems && this.listSelectedItems.length>0)
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
      this.roleService.deleteItems(this.listSelectedItems).then(res=>{
        //this.SnackBarService.showToast({message:"Se eliminaron los registros seleccionados satisfactoriamente",toastType:ToastType.Success});
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        //this.SnackBarService.showToast({message:error,toastType:ToastType.Error});
      });
    }

}
