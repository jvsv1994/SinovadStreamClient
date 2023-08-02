
import { ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { ParentComponent } from 'src/app/parent/parent.component';
import { Role } from '../shared/role.model';
import { RoleService } from '../shared/role.service';
import { Subscription } from 'rxjs';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ToastService, ToastType } from 'src/app/shared/services/toast.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomConfirmDialogComponent } from 'src/app/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { ConfirmDeleteMessageBoxOptions } from 'src/app/confirm-delete-message-box/confirmDeleteMessageBoxOptions';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.page.html',
  styleUrls: ['./role-list.page.scss']
})
export class RoleListPage extends ParentComponent implements OnInit,OnDestroy {

  totalCount:number;
  itemsPerPage:number=10;
  currentPage:number=1;
  listItems: Role[];
  listSelectedItems:Role[]=[];
  lastSelectedItem:Role;
  showContextMenu:boolean=false;
  refreshSubscription$:Subscription;
  showLoading:boolean=true;

  constructor(
    public dialog: MatDialog,
    public toastService:ToastService,
    public matPaginatorIntl: MatPaginatorIntl,
    private roleService:RoleService,
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      this.matPaginatorIntl.itemsPerPageLabel="Items por página";
      this.matPaginatorIntl.previousPageLabel="Página anterior";
      this.matPaginatorIntl.nextPageLabel="Página siguiente";
      this.refreshSubscription$=this.roleService.refreshListEvent.subscribe(event=>{
        this.getAllItems();
      });
      this.getAllItems();
    }

    public onChangePaginator(event:PageEvent){
      this.itemsPerPage=event.pageSize;
      this.currentPage=event.pageIndex+1;
      this.getAllItems();
    }

    public ngOnDestroy(): void {
      this.refreshSubscription$.unsubscribe();
    }

    public isSelectedAll(){
      if(this.listSelectedItems.length>0 && this.listSelectedItems.length==this.listItems.length)
      {
        return true;
      }else{
        return false;
      }
    }

    public isSelectedAny(){
      if(this.listSelectedItems.length>0 && this.listSelectedItems.length<this.listItems.length)
      {
        return true;
      }else{
        return false;
      }
    }

    public isSelectedNothing(){
      if(this.listSelectedItems.length==0)
      {
        return true;
      }else{
        return false;
      }
    }

    public onChangeSelectAllCheckBox(event:any){
      if(event.target.checked)
      {
        this.selectAll();
      }else{
        this.unselectAll();
      }
    }

    public selectAll(){
      for(let i=0;i < this.listItems.length;i++)
      {
        let item=this.listItems[i];
        this.listSelectedItems.push(item);
      }
    }

    public unselectAll(){
      this.listSelectedItems=[];
    }

    public onSelectItem(event:any,item:Role)
    {
      let addItems:boolean=false;
      let index=this.listSelectedItems.findIndex(ele=>ele.Id==item.Id);
      if(index!=-1)
      {
        this.listSelectedItems.splice(index,1);
        addItems=false;
      }else{
        this.listSelectedItems.push(item);
        addItems=true;
      }
      if(event.shiftKey && this.lastSelectedItem)
      {
        let lastSelectedItemIndex=0
        if(this.listSelectedItems.length>0 && this.lastSelectedItem)
        {
          lastSelectedItemIndex=this.listItems.indexOf(this.lastSelectedItem);
        }
        let currentIndex=this.listItems.indexOf(item);
        if(addItems)
        {
          if(currentIndex>=lastSelectedItemIndex)
          {
            let listItemsToAdd=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex && !this.isCheckedItem(item));
            this.listSelectedItems=this.listSelectedItems.concat(listItemsToAdd);
          }else{
            let listItemsToAdd=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex && !this.isCheckedItem(item));
            this.listSelectedItems=this.listSelectedItems.concat(listItemsToAdd);
          }
        }else{
          let listItemsToUnselect=[];
          if(currentIndex>=lastSelectedItemIndex)
          {
            listItemsToUnselect=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex && this.isCheckedItem(item));
          }else{
            listItemsToUnselect=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex && this.isCheckedItem(item));
          }
          if(listItemsToUnselect && listItemsToUnselect.length>0)
          {
            listItemsToUnselect.forEach(element => {
              let index=this.listSelectedItems.findIndex(item=>item.Id==element.Id);
              if(index!=-1)
              {
                this.listSelectedItems.splice(index,1);
              }
            });
          }
        }
      }
      this.lastSelectedItem=item;
    }

    public isCheckedItem(item:Role){
      let index=this.listSelectedItems.findIndex(ele=>ele.Id==item.Id);
      if(index!=-1)
      {
        return true;
      }else{
        return false;
      }
    }

    public onClickItem(event:any,item:Role)
    {
      if(event.ctrlKey || event.shiftKey)
      {
        if(event.ctrlKey)
        {
          if(this.listSelectedItems.indexOf(item)!=-1)
          {
            this.listSelectedItems.splice(this.listSelectedItems.indexOf(item),1)
          }else{
            this.listSelectedItems.push(item);
          }
        }else{
          let lastSelectedItemIndex=0
          if(this.listSelectedItems.length>0 && this.lastSelectedItem)
          {
            lastSelectedItemIndex=this.listItems.indexOf(this.lastSelectedItem);
          }
          let currentIndex=this.listItems.indexOf(item);
          if(currentIndex>=lastSelectedItemIndex)
          {
            let listItemsToAdd=this.listItems.filter(item=>this.listItems.indexOf(item)<=currentIndex && this.listItems.indexOf(item)>=lastSelectedItemIndex && this.listSelectedItems.indexOf(item)==-1);
            this.listSelectedItems=this.listSelectedItems.concat(listItemsToAdd);
          }else{
            let listItemsToAdd=this.listItems.filter(item=>this.listItems.indexOf(item)>=currentIndex && this.listItems.indexOf(item)<=lastSelectedItemIndex && this.listSelectedItems.indexOf(item)==-1);
            this.listSelectedItems=this.listSelectedItems.concat(listItemsToAdd);
          }
        }
      }else{
        if(event.type=="contextmenu")
        {
          if(this.listSelectedItems.indexOf(item)==-1)
          {
            this.listSelectedItems=[];
            this.listSelectedItems.push(item);
          }
        }else{
          this.listSelectedItems=[];
          this.listSelectedItems.push(item);
        }
      }
      this.lastSelectedItem=item;
    }

    public showNewRol(){
      var role= new Role();
      role.Enabled=true;
      this.roleService.showModal(role);
    }

    public editItem(role: Role){
      this.roleService.showModal(role);
    }

    public getAllItems(){
      this.showLoading=true;
      this.roleService.getItems(this.currentPage,this.itemsPerPage).then((response:SinovadApiPaginationResponse) => {
        var data=response.Data;
        this.totalCount=response.TotalCount;
        this.listItems=data;
        this.listSelectedItems=[];
        this.showLoading=false;
      },error=>{
        this.showLoading=false;
      });
    }



    public deleteItem(role:Role){
      this.showDeleteConfirmDialog(role);
    }

    public showDeleteConfirmDialog(role:Role): void {
      var config = new MatDialogConfig<ConfirmDeleteMessageBoxOptions>();
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
        this.toastService.showToast({message:"Se elimino el registro satisfactoriamente",toastType:ToastType.Success});
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.toastService.showToast({message:error,toastType:ToastType.Error});
      });
    }

    public deleteSelectedItems(){
      if(this.listSelectedItems && this.listSelectedItems.length>0)
      {
        var config = new MatDialogConfig<ConfirmDeleteMessageBoxOptions>();
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
        this.toastService.showToast({message:"Se eliminaron los registros seleccionados satisfactoriamente",toastType:ToastType.Success});
        this.getAllItems();
      },(error)=>{
        this.showLoading=false;
        this.toastService.showToast({message:error,toastType:ToastType.Error});
      });
    }

}
