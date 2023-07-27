import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/services/shared-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ParentComponent } from '../parent/parent.component';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Season } from '../../models/season';
import { TvProgram } from '../../models/tvProgram';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { ContextMenuPage } from '../context-menu/context-menu.page';
import { ContextMenuOption } from '../context-menu/contextMenuOption';
@Component({
  selector: 'app-season-list',
  templateUrl: 'season-list.page.html',
  styleUrls: ['season-list.page.scss'],
})
export class SeasonListPage extends ParentComponent implements OnInit{

  @ViewChild('contextMenuPage') contextMenuPage: ContextMenuPage;
  @Input() parentItem:TvProgram;
  _window=window;
  listItems: Season[]=[];
  listSelectedItems:Season[]=[];
  showPopUpForm:boolean=false;
  seasonData:Season;
  lastSelectedItem:Season;
  showListEpisodesPopUp:boolean=false;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  showConfirmMessageBox:boolean=false;

  constructor(
    public restProvider: RestProviderService,
    public ref: ChangeDetectorRef,
    public domSanitizer: DomSanitizer,
    public activeRoute: ActivatedRoute,
    public sharedData: SharedDataService,
    public http: HttpClient) {
      super(restProvider,domSanitizer,sharedData)

  }

  ngOnInit(): void {
    this.getAllItems();
  }

  public executeGetAllItems(page:string,take:string){
    var queryParams="?page="+page+"&take="+take;
    var path='/seasons/GetAllWithPaginationByTvSerieAsync/'+this.parentItem.Id+queryParams;
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
      this.response=response;
      var data=response.Data;
      this.listItems=data;
    },error=>{
      console.error(error);
    });
  }

  public getAllItems(){
    var page=1;
    this.executeGetAllItems(page.toString(),this.pageSize.toString());
  }

  public onSelectPage(page:string){
    this.executeGetAllItems(page,this.pageSize.toString());
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

  public executeDeleteSelectedItems(){
    this.showConfirmMessageBox=false;
    let listItemIds:number[]=[];
    for(let i=0;i < this.listSelectedItems.length;i++)
    {
      let item=this.listSelectedItems[i];
      listItemIds.push(item.Id);
    }
    var listIds=listItemIds.join(",");
    this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,'/seasons/DeleteList/'+listIds).then((response) => {
      this.listSelectedItems=[];
      this.getAllItems();
    },error=>{
      console.error(error);
    });
  }

  public deleteSelectedItems(){
    this.showConfirmMessageBox=true;
  }

  public onClickItem(event:any,item:any)
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


  public onContextMenuItem(event:any,item:any)
  {
    event.preventDefault();
    event.stopPropagation();
    this.onClickItem(event,item);
    let listOptions=[];
    listOptions.push({text:"Ver",key:"view",iconClass:"fa-solid fa-eye"});
    listOptions.push({text:"Eliminar",key:"delete",iconClass:"fa-solid fa-trash"});
    this.contextMenuPage.show("sinovadMainContainer",event.clientX,event.clientY,listOptions).then((option:ContextMenuOption) => {
      this.onClickContextMenuOption(option);
    });
  }

  public onClickContextMenuOption(option:any){
    if(option.key=="view")
    {
      this.showListEpisodesPopUp=true;
    }
    if(option.key=="delete")
    {
      this.deleteSelectedItems();
    }
  }

  public showItemForm(){
    this.seasonData=new Season();
    this.seasonData.TvSerieId=this.parentItem.Id;
    this.showPopUpForm=true;
  }

  public editItem(item: Season){
    this.seasonData=JSON.parse(JSON.stringify(item));
    this.showPopUpForm=true;
  }

  public onSaveSeason(){
    this.showPopUpForm=false;
    this.getAllItems();
  }


}
