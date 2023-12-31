
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/modules/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { RoleFormComponent } from '../role-form/role-form.component';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent extends CustomListGeneric<Role>  implements AfterViewInit {

  displayedColumns: string[] = ['Select','Id', 'Name','Actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private modalService: NgbModal,
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private roleService:RoleService) {
      super(matPaginatorIntl);
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    ngOnInit(): void {

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
      this.searchBy="Name";
      this.dataSource.sort = this.sort;
      this.getAllItems();
    }


    //Show Menus

    public showMenus(role:Role){
      this.router.navigate([role.Id,'menus'],{relativeTo:this.activatedRoute});
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
      var role= new Role();
      role.Enabled=true;
      this.showModalForm(role);
    }

    public editItem(role: Role){
      this.showModalForm(role);
    }

    public showModalForm(role:Role){
      var ctx=this;
      var ref=this.modalService.open(RoleFormComponent, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.role=role;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.roleService.getItems(this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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
      this.roleService.deleteItems(this.selection.selected).then(res=>{
        this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }

}
