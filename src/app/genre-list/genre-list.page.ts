
import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { Genre } from '../../models/genre';
import { HttpMethodType } from '../enums';
import { ContextMenuOption } from '../context-menu/contextMenuOption';
import { ContextMenuPage } from '../context-menu/context-menu.page';

@Component({
  selector: 'app-genre-list',
  templateUrl: './genre-list.page.html',
  styleUrls: ['./genre-list.page.scss']
})
export class GenreListPage extends ParentComponent implements OnInit {

  @ViewChild('contextMenuPage') contextMenuPage: ContextMenuPage;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  listItems: Genre[];
  listSelectedItems:Genre[]=[];
  lastSelectedItem:Genre;
  showContextMenu:boolean=false;

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
    var path="/genres/GetAllWithPaginationAsync"+queryParams;
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

    public onClickItem(event:any,item:Genre)
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

    public editItem(item: Genre){

    }

    public onContextMenuItem(event:any,item:Genre)
    {
      event.preventDefault();
      event.stopPropagation();
      this.onClickItem(event,item);
      let listOptions:ContextMenuOption[]=[];
      /* if(!this.isItemDisableForEdit(item))
      { */
        listOptions.push({text:"Eliminar",key:"delete",imageUrl:this.fdp.transform('remove.png', 'GetImageURLByKey')});
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

    public isItemDisableForEdit(item:Genre){
      if(item.TmdbId)
      {
        return true;
      }else{
        return false;
      }
    }
}