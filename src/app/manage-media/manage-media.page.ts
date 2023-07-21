
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import {v4 as uuid} from "uuid";
import { RestProviderService } from 'src/services/rest-provider.service';
import { CatalogEnum, HttpMethodType, MediaType } from '../enums';
import { Storage } from '../../models/storage';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaServer } from 'src/models/mediaServer';
import { CustomActionsMenuPage } from '../custom-actions-menu/custom-actions-menu.page';
import { CustomActionsMenuItem } from '../custom-actions-menu/customActionsMenuItem';

declare var window;
@Component({
  selector: 'app-manage-media',
  templateUrl: './manage-media.page.html',
  styleUrls: ['./manage-media.page.scss']
})
export class ManageMediaPage extends ParentComponent implements OnInit,OnDestroy {

  @Output() showInitial =new EventEmitter();
  listMainDirectories:any[];

  showingDirectoryMovies:boolean;

  showingDirectoryTVSeries:boolean;

  showingDirectoryTranscodeVideos:boolean;

  storageMovies:Storage={MediaTypeCatalogId:CatalogEnum.MediaType,MediaTypeCatalogDetailId:MediaType.Movie,PhysicalPath:""};
  storageTvSeries:Storage={MediaTypeCatalogId:CatalogEnum.MediaType,MediaTypeCatalogDetailId:MediaType.TvSerie,PhysicalPath:""};

  callSearchMediaLog:boolean=false;
  searchMediaLogContent:string="";

  searchingMediaInterval:any;
  listStorages:Storage[];

  currentLibrary:Storage;

  showForm:boolean=false;
  mediaServer:MediaServer;
  @ViewChild('customActionsMenuPage') customActionsMenuPage: CustomActionsMenuPage;

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.getMediaServerData();
      this.getAllMainDirectories();
    }

    ngAfterViewInit(){

    }

    ngOnDestroy(){
      if(this.searchingMediaInterval!=null)
      {
        window.clearInterval(this.searchingMediaInterval);
      }
      this.callSearchMediaLog=false;
    }

    public getAllMainDirectories(){
      this.restProvider.executeSinovadStreamServerService(HttpMethodType.GET,"/directories").then((response) => {
        this.listMainDirectories=JSON.parse(response);
      },error=>{
        console.error(error);
      });
    }

    public async getMediaServerData(){
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetByGuidAsync/'+mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        this.sharedData.selectedMediaServer=response.Data;
        this.mediaServer=this.sharedData.selectedMediaServer;
        this.getStorages();
      },error=>{
        this.router.navigateByUrl('/404')
      });
    }

    public getStorages(){
      var path="/storages/GetAllWithPaginationByMediaServerAsync/"+this.mediaServer.Id;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.listStorages=data;
        if(data && data.length>0)
        {
          let storageMovies=data.find(item=>item.MediaType==1);
          if(storageMovies)
          {
            this.storageMovies=storageMovies;
          }else{
            this.storageMovies.MediaServerId=this.sharedData.selectedMediaServer.Id;
          }
          let storageTvSeries=data.find(item=>item.MediaType==2);
          if(storageTvSeries)
          {
            this.storageTvSeries=storageTvSeries;
          }else{
            this.storageTvSeries.MediaServerId=this.sharedData.selectedMediaServer.Id;
          }
        }
      },error=>{
        console.error(error);
      });
    }

    public openNewStorage(){
      let storage= new Storage();
      storage.MediaServerId=this.sharedData.selectedMediaServer.Id;
      storage.MediaTypeCatalogId=CatalogEnum.MediaType;
      storage.MediaTypeCatalogDetailId=MediaType.Movie;
      this.currentLibrary=storage;
      this.showForm=true;
    }

    public editStorage(storage:Storage){
      this.currentLibrary=JSON.parse(JSON.stringify(storage));
      this.showForm=true;
    }

    public deleteStorage(storage:Storage){
      var path="/storages/Delete/"+storage.Id;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        this.getStorages();
      },error=>{
        console.error(error);
      });
    }

    public onCloseStorageForm(){
      this.showForm=false;
      this.currentLibrary=undefined;
    }

    public onCloseStorageFormWithChanges(){
      this.showForm=false;
      this.currentLibrary=undefined;
      this.getStorages();
    }

    public updateStorageVideos(storage:Storage){
      if(storage.Id>0 && storage.PhysicalPath!=undefined && storage.PhysicalPath!="")
      {
        var listStorages=[storage];
        this.executeUpdateVideosInAllStorages(listStorages);
      }
    }

    public updateVideoInAllStorages(){
       this.executeUpdateVideosInAllStorages(this.listStorages);
    }

    public executeUpdateVideosInAllStorages(listStorages:Storage[]){
      let logIdentifier=uuid();
      this.callSearchMediaLog=true;
      let mediaRequest: any={
        ListStorages:listStorages,
        LogIdentifier:logIdentifier
      };
      this.restProvider.executeSinovadStreamServerService(HttpMethodType.POST,'/medias/UpdateVideosInListStorages',mediaRequest).then((response) => {
        this.callSearchMediaLog=false;
        if(this.searchingMediaInterval!=null)
        {
          window.clearInterval(this.searchingMediaInterval);
        }
        this.showInitial.emit();
      },error=>{
        console.error(error);
      });
      let ctx=this;
      setTimeout(() => {
        ctx.searchingMediaInterval=window.setInterval(function() {
          ctx.getSearchMediaLog(logIdentifier);
        }, 2000);
      }, 2000,ctx);
    }

    public getSearchMediaLog(logIdentifier:string){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/logs?identifier='+logIdentifier).then((response:SinovadApiGenericResponse) => {
        this.searchMediaLogContent=response.Data;
        if(this.searchMediaLogContent==null)
        {
          if(this.searchingMediaInterval!=null)
          {
            this.callSearchMediaLog=false;
            if(this.searchingMediaInterval!=null)
            {
              window.clearInterval(this.searchingMediaInterval);
            }
            this.showInitial.emit();
          }
        }
      },error=>{
        console.error(error);
      });
    }

   public showActions(event:any,library:Storage){
      this.currentLibrary=library;
      var currentLibrary=JSON.parse(JSON.stringify(library));
      var target=event.currentTarget;
      var listItems:CustomActionsMenuItem[]=[];
      var eventOnEdit:EventEmitter<boolean>=new EventEmitter();
      eventOnEdit.subscribe(res=>{
          this.editStorage(currentLibrary);
      });
      listItems.push({title:"Editar biblioteca",iconClass:"fa-solid fa-pen-to-square",eventOnSelectItem:eventOnEdit});
      var eventOnSearch:EventEmitter<boolean>=new EventEmitter();
      eventOnSearch.subscribe(res=>{
          this.updateStorageVideos(currentLibrary);
      });
      listItems.push({title:"Buscar archivos en la biblioteca",iconClass:"fa-solid fa-magnifying-glass-plus",eventOnSelectItem:eventOnSearch});
      var eventOnDelete:EventEmitter<boolean>=new EventEmitter();
      eventOnDelete.subscribe(res=>{
          this.deleteStorage(currentLibrary);
      });
      listItems.push({title:"Eliminar biblioteca",iconClass:"fa-sharp fa-solid fa-trash",eventOnSelectItem:eventOnDelete});
      this.customActionsMenuPage.show({target:target,containerId:"sinovadMainContainer",listItems:listItems});
   }

   public onHideCustomActionsMenu(){
      this.currentLibrary=undefined;
   }

}
