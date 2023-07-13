
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import {v4 as uuid} from "uuid";
import { RestProviderService } from 'src/services/rest-provider.service';
import { CatalogEnum, HttpMethodType, MediaType } from '../enums';
import { Storage } from '../models/storage';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';

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

  storage:Storage;

  showForm:boolean=false;

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(){
      this.getAllMainDirectories();
      this.getStorages();
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

    public getStorages(){
      var path="/storages/GetAllWithPaginationByMediaServerAsync/"+this.sharedData.currentMediaServerData.Id;
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
            this.storageMovies.MediaServerId=this.sharedData.currentMediaServerData.Id;
          }
          let storageTvSeries=data.find(item=>item.MediaType==2);
          if(storageTvSeries)
          {
            this.storageTvSeries=storageTvSeries;
          }else{
            this.storageTvSeries.MediaServerId=this.sharedData.currentMediaServerData.Id;
          }
        }
      },error=>{
        console.error(error);
      });
    }

    public openNewStorage(){
      let storage= new Storage();
      storage.MediaServerId=this.sharedData.currentMediaServerData.Id;
      storage.MediaTypeCatalogId=CatalogEnum.MediaType;
      storage.MediaTypeCatalogDetailId=MediaType.Movie;
      this.storage=storage;
      this.showForm=true;
    }

    public editStorage(storage:Storage){
      this.storage=JSON.parse(JSON.stringify(storage));
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
    }

    public onCloseStorageFormWithChanges(){
      this.showForm=false;
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

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }

}
