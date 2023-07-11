
import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import {v4 as uuid} from "uuid";
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType, ItemType } from '../Enums';
import { AccountStorage } from '../models/accountStorage';
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

  accountStorageMovies:AccountStorage={AccountStorageTypeId:1,PhisicalPath:""};
  accountStorageTvSeries:AccountStorage={AccountStorageTypeId:2,PhisicalPath:""};

  callSearchMediaLog:boolean=false;
  searchMediaLogContent:string="";

  searchingMediaInterval:any;
  listAccountStorages:AccountStorage[];

  accountStorage:AccountStorage;

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
      this.getAccountStorages();
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

    public getAccountStorages(){
      var path="/accountStorages/GetAllWithPaginationByAccountServerAsync/"+this.sharedData.currentAccountServerData.Id;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.listAccountStorages=data;
        if(data && data.length>0)
        {
          let accountStorageMovies=data.find(item=>item.AccountStorageTypeId==1);
          if(accountStorageMovies)
          {
            this.accountStorageMovies=accountStorageMovies;
          }else{
            this.accountStorageMovies.AccountServerId=this.sharedData.currentAccountServerData.Id;
          }
          let accountStorageTvSeries=data.find(item=>item.AccountStorageTypeId==2);
          if(accountStorageTvSeries)
          {
            this.accountStorageTvSeries=accountStorageTvSeries;
          }else{
            this.accountStorageTvSeries.AccountServerId=this.sharedData.currentAccountServerData.Id;
          }
        }
      },error=>{
        console.error(error);
      });
    }

    public openNewAccountStorage(){
      let accountStorage= new AccountStorage();
      accountStorage.AccountServerId=this.sharedData.currentAccountServerData.Id;
      accountStorage.AccountStorageTypeId=ItemType.Movie;
      this.accountStorage=accountStorage;
      this.showForm=true;
    }

    public editStorage(accountStorage:AccountStorage){
      this.accountStorage=JSON.parse(JSON.stringify(accountStorage));
      this.showForm=true;
    }

    public deleteStorage(accountStorage:AccountStorage){
      var path="/accountStorages/Delete/"+accountStorage.Id;
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,path).then((response:SinovadApiGenericResponse) => {
        this.getAccountStorages();
      },error=>{
        console.error(error);
      });
    }

    public onCloseAccountStorageForm(){
      this.showForm=false;
    }

    public onCloseAccountStorageFormWithChanges(){
      this.showForm=false;
      this.getAccountStorages();
    }

    public updateStorageVideos(accountStorage:AccountStorage){
      if(accountStorage.Id>0 && accountStorage.PhisicalPath!=undefined && accountStorage.PhisicalPath!="")
      {
        var listAccountStorages=[accountStorage];
        this.executeUpdateVideosInAllStorages(listAccountStorages);
      }
    }

    public updateVideoInAllStorages(){
       this.executeUpdateVideosInAllStorages(this.listAccountStorages);
    }

    public executeUpdateVideosInAllStorages(listAccountStorages:AccountStorage[]){
      let logIdentifier=uuid();
      this.callSearchMediaLog=true;
      let mediaRequest: any={
        ListAccountStorages:listAccountStorages,
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
        }, 1000);
      }, 500,ctx);
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
