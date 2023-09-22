import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Catalog } from '../../model/catalog.model';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/modules/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { CatalogService } from '../../services/catalog.services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.scss']
})
export class CatalogListComponent extends CustomListGeneric<Catalog> implements AfterViewInit{


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private catalogService:CatalogService) {
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
      this.sortBy="Id";
      this.sortDirection="asc";
      this.sort.disableClear=true;
      this.searchBy="Name";
      this.dataSource.sort = this.sort;
      this.getAllItems();
    }


    //Apply Filters Section

    public applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.searchText=filterValue.trim().toLowerCase();
      this.currentPage=1;
      this.getAllItems();
    }

    public showNewItem(){
      this.router.navigate(["add"],{relativeTo:this.activatedRoute});
    }

    public editItem(catalog: Catalog){
      this.router.navigate(["edit",catalog.Id.toString()],{relativeTo:this.activatedRoute});
    }

    public showDetails(catalog: Catalog){
      this.router.navigate(["details",catalog.Id.toString()],{relativeTo:this.activatedRoute});
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.catalogService.getAllWithPagination(this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

    public delete(catalog:Catalog){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el catálogo '+catalog.Name+'?',accordMessage:"Si, eliminar el catálogo '"+catalog.Name+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteItem(catalog);
        }
      });
    }

    private executeDeleteItem(Catalog:Catalog){
      this.showLoading=true;
      this.catalogService.delete(Catalog.Id).then(res=>{
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
          title:"Eliminar catálogos",message:'¿Esta seguro que desea eliminar los registros seleccionados?',accordMessage:"Si, eliminar"
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
      this.catalogService.deleteItems(this.selection.selected).then(res=>{
        this.snackbarService.showSnackBar("Se eliminaron los registros seleccionados satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.snackbarService.showSnackBar(error,SnackBarType.Error);
      });
    }

    //Displayed Columns Section

    public getDisplayedColumns(){
      return ['Select','Id', 'Name','Actions'];
    }

}
