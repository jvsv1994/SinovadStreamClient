
import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { HttpMethodType } from '../enums';
import { ContextMenuOption } from '../context-menu/contextMenuOption';
import { ContextMenuPage } from '../context-menu/context-menu.page';
import { Menu } from 'src/models/menu';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.page.html',
  styleUrls: ['./menu-list.page.scss']
})
export class MenuListPage extends ParentComponent implements OnInit {

  @ViewChild('contextMenuPage') contextMenuPage: ContextMenuPage;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  listItems: Menu[];
  listSelectedItems:Menu[]=[];
  lastSelectedItem:Menu;
  showContextMenu:boolean=false;
  showPopUpForm:boolean=false;
  menu:Menu;

  constructor(
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public ngOnInit(): void {
      this.getAllItems();
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
    var path="/menus/GetAllWithPaginationAsync"+queryParams;
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
        for(let i=0;i < this.listItems.length;i++)
        {
          let item=this.listItems[i];
          this.listSelectedItems.push(item);
        }
      }else{
        this.listSelectedItems=[];
      }
    }

    public onClickItem(event:any,item:Menu)
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

    public showItemForm(){

    }

    public editItem(item: Menu){
      this.menu=JSON.parse(JSON.stringify(item));
      this.showPopUpForm=true;
    }

    public onContextMenuItem(event:any,item:Menu)
    {
      event.preventDefault();
      event.stopPropagation();
      this.onClickItem(event,item);
      let listOptions:ContextMenuOption[]=[];
      /* if(!this.isItemDisableForEdit(item))
      { */
        //listOptions.push({text:"Eliminar",key:"delete",imageUrl:this.fdp.transform('remove.png', 'GetImageURLByKey')});
      //}
      if(listOptions && listOptions.length>0)
      {
        this.renderContextMenuComponent(event.clientX,event.clientY,listOptions);
      }
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

    public isItemDisableForEdit(item:Menu){
        return false;
    }

    public onSaveItem(){
      this.showPopUpForm=false;
      this.getAllItems();
    }
}
