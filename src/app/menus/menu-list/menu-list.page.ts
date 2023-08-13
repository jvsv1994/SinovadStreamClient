
import { AfterViewInit, Component, ViewChild} from '@angular/core';
import { CustomListGeneric } from 'src/app/shared/generics/custom-list.generic';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MenuService } from '../shared/menu.service';
import { Menu } from '../shared/menu.model';
import { MenuFormPage } from '../menu-form/menu-form.page';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.page.html',
  styleUrls: ['./menu-list.page.scss']
})
export class MenuListPage extends CustomListGeneric<Menu> implements AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router:Router,
    private modalService: NgbModal,
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private menuService:MenuService) {
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
      var menu= new Menu();
      menu.Enabled=true;
      this.showModalForm(menu);
    }

    public editItem(menu: Menu){
      this.showModalForm(menu);
    }


    public showModalForm(menu:Menu){
      var ctx=this;
      var ref=this.modalService.open(MenuFormPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.menu=menu;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }


    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.menuService.getItems(this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

    public deleteItem(menu:Menu){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el menu '+menu.Title+'?',accordMessage:"Si, eliminar el menu '"+menu.Title+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteItem(menu);
        }
      });
    }

    private executeDeleteItem(menu:Menu){
      this.showLoading=true;
      this.menuService.deleteItem(menu.Id).then(res=>{
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
          title:"Eliminar menus",message:'¿Esta seguro que desea eliminar los registros seleccionados?',accordMessage:"Si, eliminar"
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
      this.menuService.deleteItems(this.selection.selected).then(res=>{
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
        return ['Select','Id', 'Title', 'Path', 'IconClass', 'SortOrder','Actions'];
      }else if(window.innerWidth>875){
        return ['Select','Id', 'Title', 'Path', 'IconClass','Actions'];
      }else if(window.innerWidth>495){
        return ['Select','Id', 'Title', 'Path','Actions'];
      }else{
        return ['Select','Id', 'Title','Actions'];
      }
    }

}
