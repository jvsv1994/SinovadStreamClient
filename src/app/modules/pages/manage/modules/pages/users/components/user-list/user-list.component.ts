
import { Component, ViewChild} from '@angular/core';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/modules/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { ContextMenuService } from 'src/app/modules/shared/services/context-menu.service';
import { ContextMenuOption } from 'src/app/modules/shared/components/custom-context-menu/custom-context-menu.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { MediaServerListModalComponent } from '../../../servers/components/server-list-modal/media-server-list-modal.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent extends CustomListGeneric<User> {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router:Router,
    private modalService: NgbModal,
    private contextMenuService:ContextMenuService,
    private dialog: MatDialog,
    private userService:UserService,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService) {
      super(matPaginatorIntl)

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
      this.sortBy="UserName";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.sort.sort({
        id:"UserName",
        start:"asc",
        disableClear:true
      });
      this.searchBy="UserName|Email|FirstName|LastName";
      this.dataSource.sort = this.sort;
    }

    //Apply Filters Section

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchText=filterValue.trim().toLowerCase();
      this.currentPage=1;
      this.getAllItems();
    }


    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.userService.getItems(this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

    public deleteItem(user:User){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar usuario',message:'¿Esta seguro que desea eliminar el usuario '+user.UserName+'?',accordMessage:"Si, eliminar el usuario '"+user.UserName+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteItem(user);
        }
      });
    }

    private executeDeleteItem(user:User){
      this.showLoading=true;
      this.userService.deleteItem(user.Id).then(res=>{
        this.snackbarService.showSnackBar("Se elimino el registro satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }


    //Displayed Columns Section

    public getDisplayedColumns(){
      if(window.innerWidth>1050)
      {
        return ['Id', 'UserName','Email','FirstName','LastName','Actions'];
      }else if(window.innerWidth>950)
      {
        return ['Id', 'UserName','Email','FirstName','Actions'];
      }else if(window.innerWidth>675){
        return ['Id', 'UserName','Email','Actions'];
      }else if(window.innerWidth>375){
        return ['Id', 'UserName','Actions'];
      }{
        return ['Id', 'UserName','Actions'];
      }
    }

    //Context Menu Section

    public onContextMenuItem(event:any,user:User)
    {
      this.lastSelectedItem=user;
      event.preventDefault();
      event.stopPropagation();
      let listOptions:ContextMenuOption[]=[];
      listOptions.push({key:"ShowMediaServers",text:"Servidores multimedia",iconClass:"fa-solid fa-server"});
      if(listOptions && listOptions.length>0)
      {
        this.renderContextMenuComponent(event.clientX,event.clientY,listOptions,user);
      }
    }

    private renderContextMenuComponent(left:number,top:number,listOptions:ContextMenuOption[],user:User) {
      this.contextMenuService.show("sinovadMainContainer",left,top,listOptions).then((option:ContextMenuOption) => {
        if(option.key=="ShowMediaServers")
        {
          this.showMediaServerListModal(user);
        }
      },()=>{
        this.lastSelectedItem=undefined;
      });
    }

    //Media Server List Modal Section

    private showMediaServerListModal(user:User){
      var ctx=this;
      var ref=this.modalService.open(MediaServerListModalComponent, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-xl modal-dialog-centered modal-dialog-scrollable  modal-list',scrollable:true,backdrop: 'static'});
      ref.componentInstance.parent=user;
      ref.closed.subscribe(x=>{
        ctx.lastSelectedItem=undefined;
      })
    }

}
