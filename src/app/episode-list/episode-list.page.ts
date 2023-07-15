import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentComponent } from '../parent/parent.component';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { DomSanitizer } from '@angular/platform-browser';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Episode } from '../../models/episode';
import { Season } from '../../models/season';
import { TvProgram } from '../../models/tvProgram';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { ContextMenuPage } from '../context-menu/context-menu.page';
import { ContextMenuOption } from '../context-menu/contextMenuOption';
@Component({
  selector: 'app-episode-list',
  templateUrl: 'episode-list.page.html',
  styleUrls: ['episode-list.page.scss'],
})
export class EpisodeListPage extends ParentComponent implements OnInit{

  @ViewChild('contextMenuPage') contextMenuPage: ContextMenuPage;
  @Input() parentItem:Season;
  _window=window;
  listItems: Episode[];
  listSelectedItems:Episode[]=[];
  lastSelectedItem:Episode;
  showPopUpForm:boolean=false;
  showChangeSeasonForm:boolean=false;
  itemData:TvProgram;
  episode:Episode;
  listSeasons:Season[]=[];
  selectedSeasonID:number;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  showEpisodeRangeModal:boolean=false;
  showConfirmMessageBox:boolean=false;

  constructor(
    public restProvider: RestProviderService,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public activeRoute: ActivatedRoute,
    public sharedData: SharedDataService,
    public http: HttpClient) {
      super(restProvider,events,domSanitizer,sharedData)

  }

  ngOnInit(): void {
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
    var path='/episodes/GetAllWithPaginationBySeasonAsync/'+this.parentItem.Id+queryParams;
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
      let data=response.Data;
      this.response=response;
      this.listItems=data;
    },error=>{
      console.error(error);
    });
  }

  public onFileSelected(event:any)
  {
    if(event.target.files && event.target.files.length>0)
    {
      let file:File =event.target.files[0];
      let ctx=this;
      const fr = new FileReader();
      fr.onload = (e:any) => {
        let result=e.target.result;
        ctx.registerMultipleEpisodesFromTxtResult(result);
      };
      fr.readAsText(file);
    }
  }

  public registerMultipleEpisodesFromTxtResult(result:string){
    let listTextEpisodes=result.split("\n");
    if(listTextEpisodes && listTextEpisodes.length>0)
    {
      let listEpisodes:Episode[]=[];
      for(let i=0;i < listTextEpisodes.length;i++)
      {
        let title=listTextEpisodes[i];
        var episode= new Episode();
        episode.EpisodeNumber=i+1;
        episode.SeasonId=this.parentItem.Id;
        episode.Title=title;
        listEpisodes.push(episode);
      }
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/episodes/CreateList',listEpisodes).then((response) => {
        this.getAllItems();
      },error=>{
        console.error(error);
      });
    }
  }


  public showEpisodeRangeForm(){
    this.showEpisodeRangeModal=true;
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
    this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,'/episodes/DeleteList/'+listIds).then((response) => {
      this.listSelectedItems=[];
      this.getAllItems();
    },error=>{
      console.error(error);
    });
  }

  public deleteSelectedItems(){
    this.showConfirmMessageBox=true;
  }

  public onContextMenuItem(event:any,item:any)
  {
    event.preventDefault();
    event.stopPropagation();
    this.onClickItem(event,item);
    let listOptions=[];
    listOptions.push({text:"Eliminar",key:"delete",imageUrl:this.fdp.transform('remove.png', 'GetImageURLByKey')});
    this.contextMenuPage.show("sinovadMainContainer",event.clientX,event.clientY,listOptions).then((option:ContextMenuOption) => {
      this.onClickContextMenuOption(option);
    });
  }

  public onClickContextMenuOption(option:any){
    if(option.key=="changeSeason")
    {
      this.showChangeSeasonForm=true;
    }
    if(option.key=="delete")
    {
      this.deleteSelectedItems();
    }
  }

  public onChangeSeason(event:any){
     this.selectedSeasonID=parseInt(event.target.value);
  }

  public saveChangeSeason(){
    /*
    let ListItemsIds:number[]=[];
    for(let i=0;i < this.listSelectedItems.length;i++)
    {
      let item=this.listSelectedItems[i];
      ListItemsIds.push(item.ID);
    }
    const body: any={
      ListItemsIds:ListItemsIds,
      SeasonID:this.selectedSeasonID
    };
    this.restProvider.executeHttpPostMethod('/Episode/ChangeSeasonInEpisodeList',body).then((response) => {
      this.listSelectedItems=[];
      this.getItemsData();
      this.showChangeSeasonForm=false;
    },error=>{
      console.error(error);
    });*/
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

  public showItemForm(){
    let episodeNumber=1;
    if(this.listItems && this.listItems.length>0)
    {
      episodeNumber=(this.listItems[this.listItems.length-1].EpisodeNumber)+1;
    }
    var episode=new Episode();
    episode.EpisodeNumber=episodeNumber;
    episode.SeasonId=this.parentItem.Id;
    this.episode=episode;
    this.showPopUpForm=true;
  }

  public editItem(item: Episode){
    this.episode=JSON.parse(JSON.stringify(item));
    this.showPopUpForm=true;
  }

  public onSaveEpisode(){
    this.showPopUpForm=false;
    this.getAllItems();
  }

  public onSaveEpisodeRange(){
    this.showEpisodeRangeModal=false;
    this.getAllItems();
  }

}
