import { Component, HostListener, Input, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ParentComponent } from '../parent/parent.component';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { TvProgram } from '../../models/tvProgram';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from '../shared/components/custom-snack-bar/custom-snack-bar.component';
import { ContextMenuService } from '../shared/services/context-menu.service';
import { ContextMenuOption } from '../shared/components/custom-context-menu/custom-context-menu.component';
@Component({
  selector: 'app-item-list',
  templateUrl: 'item-list.page.html',
  styleUrls: ['item-list.page.scss'],
})
export class ItemListPage extends ParentComponent implements OnInit{

  _window=window;
  @Input() currentMediaTypeID: number;
  @Input() title: string='';
  listItems: TvProgram[];
  listSelectedItems:TvProgram[]=[];
  showPopUpForm:boolean=false;
  showListSeasonsPopUp:boolean=false;
  item:TvProgram;
  filename:string;
  lastSelectedItem:TvProgram;
  downloadUrl:any=undefined;
  response:SinovadApiPaginationResponse;
  pageSize:number=10;
  showConfirmMessageBox:boolean=false;

  constructor(
    private contextMenuService:ContextMenuService,
    private snackBarService:SnackBarService,
    public restProvider: RestProviderService,
    public activeRoute: ActivatedRoute,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService,
    public http: HttpClient) {
      super(restProvider,domSanitizer,sharedData)

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.getAllItems();
  }

  public getAllItems(){
    var page=1;
    this.executeGetAllItems(page.toString(),this.pageSize.toString());
  }

  public getYearValueFromItem(item:TvProgram){
    if(item.ReleaseDate)
    {
      return this.getYearByDateFormat(item.ReleaseDate);
    }else{
      if(this.getYearByDateFormat(item.FirstAirDate)!=this.getYearByDateFormat(item.LastAirDate)){
        return this.getYearByDateFormat(item.FirstAirDate)+" - "+this.getYearByDateFormat(item.LastAirDate);
      }else{
        return this.getYearByDateFormat(item.FirstAirDate);
      }
    }
  }

  public isItemDisableForEdit(item:TvProgram){
    if(item.TmdbId || item.Imdbid)
    {
      return true;
    }else{
      return false;
    }
  }

  public onSelectPage(page:string){
    this.executeGetAllItems(page,this.pageSize.toString());
  }

  public showItemForm(){
    let itemTmp=new TvProgram();
    if(this.currentMediaTypeID==MediaType.Movie)
    {
      itemTmp.ReleaseDate=new Date();
    }
    if(this.currentMediaTypeID==MediaType.TvSerie)
    {
      itemTmp.FirstAirDate=new Date();
      itemTmp.LastAirDate=new Date();
    }
    this.item=itemTmp;
    this.showPopUpForm=true;
  }

  public editItem(item: TvProgram){
    this.item=item;
    this.getGenresByitem();
  }

  public getGenresByitem(){
    if(this.currentMediaTypeID==MediaType.Movie)
    {
      this.getMovie();
    }
    if(this.currentMediaTypeID==MediaType.TvSerie)
    {
      this.getTvSerie();
    }
  }

  public getMovie(){
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/movies/GetAsync/"+this.item.Id).then((response:SinovadApiGenericResponse) => {
      this.item=response.Data;
      this.transformDates();
      this.showPopUpForm=true;
    },error=>{
      console.error(error);
    });
  }

  public executeGetAllItems(page:string,take:string){
    var queryParams="?page="+page+"&take="+take;
    var path=this.currentMediaTypeID==MediaType.Movie?'/movies/GetAllWithPaginationAsync'+queryParams:'/tvseries/GetAllWithPaginationAsync'+queryParams;
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiPaginationResponse) => {
      this.response=response;
      var data=response.Data;
      this.listItems=data;
    },error=>{
      console.error(error);
    });
  }

  public getTvSerie(){
    this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/tvseries/GetAsync/"+this.item.Id).then((response:SinovadApiGenericResponse) => {
      this.item=response.Data;
      this.transformDates();
      this.showPopUpForm=true;
    },error=>{
      console.error(error);
    });
  }

  public transformDates(){
    if(this.item.ReleaseDate)
    {
      this.item.ReleaseDate=new Date(this.item.ReleaseDate);
    }
    if(this.item.FirstAirDate)
    {
      this.item.FirstAirDate=new Date(this.item.FirstAirDate);
    }
    if(this.item.LastAirDate)
    {
      this.item.LastAirDate=new Date(this.item.LastAirDate);
    }
  }

  public onSaveItem(){
    this.snackBarService.showSnackBar("Se guardaron los cambios satisfactoriamente",SnackBarType.Success);
    this.showPopUpForm=false;
    this.getAllItems();
  }

  public onContextMenuItem(event:any,item:TvProgram)
  {
    event.preventDefault();
    event.stopPropagation();
    this.onClickItem(event,item);
    let listOptions:ContextMenuOption[]=[];
    if(this.currentMediaTypeID==MediaType.TvSerie && !this.isItemDisableForEdit(item))
    {
      listOptions.push({text:"Ver",key:"view",iconClass:"fa-solid fa-eye"});
    }
    if(!this.isItemDisableForEdit(item))
    {
      listOptions.push({text:"Eliminar",key:"delete",iconClass:"fa-solid fa-trash"});
    }
    this.renderContextMenuComponent(event.clientX,event.clientY,listOptions);
  }

  private renderContextMenuComponent(left:number,top:number,listOptions:ContextMenuOption[]) {
    this.contextMenuService.show("sinovadMainContainer",left,top,listOptions).then((option:ContextMenuOption) => {
      this.onClickContextMenuOption(option);
    });
  }


  public onClickContextMenuOption(option:any){
    if(option.key=="view" && this.currentMediaTypeID==MediaType.TvSerie)
    {
      this.showListSeasonsPopUp=true;
    }
    if(option.key=="delete")
    {
      this.deleteSelectedItems();
    }
  }

  public getTitleWidth(){
    if(this.currentMediaTypeID==MediaType.Movie){
      return 'calc(100% - 120px)';
    }else{
      return 'calc(100% - 120px)';
    }
  }


  public downloadJSON(downloadLink:any){
    downloadLink.click();
  }

  public generateDownloadJsonFileUrl() {
   /*  let listItemsJson=[];
    for(let i=0;i < this.listItems.length;i++)
    {
      let item=this.listItems[i];
      let itemJson:any={
        Title:item.Title,
        OrderNumber:item.OrderNumber,
        ReleaseYear:item.ReleaseYear,
        Summary:item.Summary,
        Directors:item.Directors,
        Actors:item.Actors,
        ImageUrl:item.ImageUrl,
      }
      listItemsJson.push(itemJson);
    }
    let currentDate= new Date();
    this.filename = "peliculas_"+currentDate.getTime();
    var data = JSON.stringify(listItemsJson);
    var url = this.sanitizer.bypassSecurityTrustUrl(
      "data:text/json;charset=UTF-8," + encodeURIComponent(data)
    );
    this.downloadUrl = url; */
  }



  @HostListener('window:resize', ['$event'])
  onResize(event) {

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
    if(this.listSelectedItems && this.listSelectedItems.length>0)
    {
      let listItemIds:number[]=[];
      for(let i=0;i < this.listSelectedItems.length;i++)
      {
        let item=this.listSelectedItems[i];
        listItemIds.push(item.Id);
      }
      var listIds=listItemIds.join(",");
      var routePath="";
      if(this.currentMediaTypeID==MediaType.Movie)
      {
        routePath='/movies/DeleteList/'+listIds;
      }
      if(this.currentMediaTypeID==MediaType.TvSerie)
      {
        routePath='/tvseries/DeleteList/'+listIds;
      }
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,routePath).then((response) => {
        this.listSelectedItems=[];
        this.getAllItems();
      },error=>{
        console.error(error);
      });
    }
  }

  public deleteSelectedItems(){
    this.showConfirmMessageBox=true;
  }

  public onClickItem(event:any,item:TvProgram)
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



}
