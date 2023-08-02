
import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { HttpMethodType } from 'src/app/shared/enums';
import { ContextMenuOption } from '../context-menu/contextMenuOption';
import { ContextMenuPage } from '../context-menu/context-menu.page';
import { User } from 'src/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.page.html',
  styleUrls: ['./user-list.page.scss']
})
export class UserListPage extends ParentComponent implements OnInit {

  @ViewChild('contextMenuPage') contextMenuPage: ContextMenuPage;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  listItems: User[];
  listSelectedItems:User[]=[];
  lastSelectedItem:User;
  showContextMenu:boolean=false;
  showPopUpForm:boolean=false;
  showMediaServersModal:boolean=false;

  constructor(
    public restProvider: RestProviderService,
    public  ref:ChangeDetectorRef,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

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
    var path="/users/GetAllWithPaginationAsync"+queryParams;
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

    public onClickItem(event:any,item:User)
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

    public editItem(item: User){
      this.showPopUpForm=true;
    }

    public onContextMenuItem(event:any,item:User)
    {
      event.preventDefault();
      event.stopPropagation();
      this.onClickItem(event,item);
      let listOptions:ContextMenuOption[]=[];
      var ctx=this;
      var eventOnSelectOption=new EventEmitter<boolean>();
      eventOnSelectOption.subscribe(event => {
        ctx.showMediaServersModal=true;
      });
      listOptions.push({text:"Servidores multimedia",iconClass:"fa-solid fa-server",eventOnSelectOption:eventOnSelectOption});
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

    public isItemDisableForEdit(item:User){
        return false;
    }

    public onSaveItem(){
      this.showPopUpForm=false;
      this.getAllItems();
      this.getMenus();
    }
}
