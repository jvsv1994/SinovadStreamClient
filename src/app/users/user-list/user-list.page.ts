
import { Component, OnInit, ViewChild} from '@angular/core';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { User } from '../shared/user.model';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { UserService } from '../shared/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { ContextMenuService } from 'src/app/shared/services/context-menu.service';
import { ContextMenuOption } from 'src/app/shared/components/custom-context-menu/custom-context-menu.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss']
})
export class UserListPage extends CustomListGeneric<User> implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  showContextMenu:boolean=false;
  showMediaServersModal:boolean=false;

  constructor(
    private contextMenuService:ContextMenuService,
    private dialog: MatDialog,
    private userService:UserService,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService) {
      super(matPaginatorIntl)

    }

    public ngOnInit(): void {
      this.refreshSubscription$=this.userService.refreshListEvent.subscribe(event=>{
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

    //Show Modal Section

    public showNewItem(){
      var user= new User();
      user.Active=true;
      this.userService.showModal(user);
    }

    public editItem(user: User){
      this.userService.showModal(user);
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
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el usuario '+user.UserName+'?',accordMessage:"Si, eliminar el usuario '"+user.UserName+"'"
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
      this.userService.deleteItems(this.selection.selected).then(res=>{
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
        return ['Id', 'UserName','Email','FirstName','LastName'];
      }else if(window.innerWidth>475){
        return ['Id', 'UserName','Email','LastName'];
      }else if(window.innerWidth>375){
        return ['Id', 'UserName','Email'];
      }{
        return ['Id', 'UserName'];
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
        this.renderContextMenuComponent(event.clientX,event.clientY,listOptions);
      }
    }

    private renderContextMenuComponent(left:number,top:number,listOptions:ContextMenuOption[]) {
      var ctx=this;
      this.contextMenuService.show("sinovadMainContainer",left,top,listOptions).then((option:ContextMenuOption) => {
        if(option.key=="ShowMediaServers")
        {
          ctx.showMediaServersModal=true;
        }
        //ctx.lastSelectedItem=undefined;
      },()=>{
        //ctx.lastSelectedItem=undefined;
      });
    }

}
