
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ContextMenuPage } from 'src/app/context-menu/context-menu.page';
import { SinovadApiPaginationResponse } from 'src/app/response/sinovadApiPaginationResponse';
import { ParentComponent } from 'src/app/parent/parent.component';
import { HttpMethodType } from 'src/app/enums';
import { ContextMenuOption } from 'src/app/context-menu/contextMenuOption';
import { Role } from '../shared/role.model';
import { RoleService } from '../shared/role.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.page.html',
  styleUrls: ['./role-list.page.scss']
})
export class RoleListPage extends ParentComponent implements OnInit,OnDestroy {

  @ViewChild('contextMenuPage') contextMenuPage: ContextMenuPage;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  listItems: Role[];
  listSelectedItems:Role[]=[];
  lastSelectedItem:Role;
  showContextMenu:boolean=false;
  refreshSubscription$:Subscription;

  constructor(
    private roleService:RoleService,
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      this.refreshSubscription$=this.roleService.refreshListEvent.subscribe(event=>{
        this.getAllItems();
      });
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

    public getAllItems(){
      var page=1;
      this.executeGetAllItems(page.toString(),this.pageSize.toString());
    }

    public onSelectPage(page:string){
      this.executeGetAllItems(page,this.pageSize.toString());
    }

  public executeGetAllItems(page:string,take:string){
    var queryParams="?page="+page+"&take="+take;
    var path="/roles/GetAllWithPaginationAsync"+queryParams;
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
      this.response=response;
      var data=response.Data;
      this.listItems=data;
    },error=>{
      console.error(error);
    });
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
      this.roleService.showModal(role);
    }

    public editItem(role: Role){
      this.roleService.showModal(role);
    }

    public deleteItem(role:Role){

    }

    public deleteSelectedItems(){

    }

    public onContextMenuItem(event:any,item:Role)
    {
      event.preventDefault();
      event.stopPropagation();
      this.onClickItem(event,item);
      let listOptions:ContextMenuOption[]=[];
      listOptions.push({text:"Eliminar",key:"delete",iconClass:"fa-solid fa-trash"});
      this.renderContextMenuComponent(event.clientX,event.clientY,listOptions);
    }

    public onClickContextMenuOption(option:ContextMenuOption){
      if(option.key=="delete")
      {
        console.log(option);
      }
    }

    private renderContextMenuComponent(left:number,top:number,listOptions:ContextMenuOption[]) {
      this.contextMenuPage.show("sinovadMainContainer",left,top,listOptions).then((option:ContextMenuOption) => {
        this.onClickContextMenuOption(option);
      });
    }

    public isItemDisableForEdit(item:Role){
        return false;
    }
}
