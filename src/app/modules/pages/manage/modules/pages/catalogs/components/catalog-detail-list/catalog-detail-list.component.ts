import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { CatalogDetail } from '../../model/catalog-detail.model';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/modules/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { CatalogDetailService } from '../../services/catalog-detail.service';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Catalog } from '../../model/catalog.model';
import { CatalogService } from '../../services/catalog.services';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

@Component({
  selector: 'app-catalog-detail-list',
  templateUrl: './catalog-detail-list.component.html',
  styleUrls: ['./catalog-detail-list.component.scss']
})
export class CatalogDetailListComponent extends CustomListGeneric<CatalogDetail>{


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  catalog:Catalog;

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private dialog: MatDialog,
    public matPaginatorIntl: MatPaginatorIntl,
    private snackbarService:SnackBarService,
    private catalogService:CatalogService,
    private catalogDetailService:CatalogDetailService) {
      super(matPaginatorIntl);
    }

    ngOnInit(): void {
      var catalogId=this.activatedRoute.snapshot.params.catalogId;
      if(catalogId!=null)
      {
        this.catalogService.get(catalogId).then((response:SinovadApiGenericResponse)=>{
          this.catalog=response.Data;
          this.changeDetectorRef.detectChanges();
          this.initializeData();
        },error=>{
          this.router.navigateByUrl("/404");
        });
      }
    }

    private initializeData() {
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
      this.sort.sort({
        id:"Id",
        start:"asc",
        disableClear:true
      });
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

    public editItem(catalogDetail: CatalogDetail){
      this.router.navigate(["edit",catalogDetail.Id.toString()],{relativeTo:this.activatedRoute});
    }

    //Get Data Section

    public getAllItems(){
      this.showLoading=true;
      this.catalogDetailService.getAllWithPagination(this.catalog.Id,this.currentPage,this.itemsPerPage,this.sortBy,this.sortDirection,this.searchText,this.searchBy).then((response:SinovadApiPaginationResponse) => {
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

    public delete(catalogDetail:CatalogDetail){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:'Eliminar rol',message:'¿Esta seguro que desea eliminar el catálogo '+catalogDetail.Name+'?',accordMessage:"Si, eliminar el catálogo '"+catalogDetail.Name+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDelete(catalogDetail);
        }
      });
    }

    private executeDelete(catalogDetail:CatalogDetail){
      this.showLoading=true;
      this.catalogDetailService.delete(this.catalog.Id,catalogDetail.Id).then(res=>{
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
      this.catalogDetailService.deleteList(this.catalog.Id,this.selection.selected).then(res=>{
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
