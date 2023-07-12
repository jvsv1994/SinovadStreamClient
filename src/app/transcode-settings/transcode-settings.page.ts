
import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { CatalogEnum, HttpMethodType } from '../Enums';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { TranscodeSetting } from '../models/transcodeSetting';

declare var window;
@Component({
  selector: 'app-transcode-settings',
  templateUrl: './transcode-settings.page.html',
  styleUrls: ['./transcode-settings.page.scss']
})
export class TranscodeSettingsPage extends ParentComponent implements OnInit {


  listMainDirectories:any[];

  showingDirectoryMovies:boolean;
  directoryMovies:string="";

  showingDirectoryTVSeries:boolean;
  directoryTvSeries:string="";

  showingDirectoryTranscodeVideos:boolean;

  transmissionMethodList:any[]=[];
  presetList:any[]=[];
  currentTranscodeSettings:TranscodeSetting;
  showSucessMessage:boolean=false;

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.getAllMainDirectories();
      this.getCatalogDetails();
    }

    public getCatalogDetails(){
      let listCatalogIds=CatalogEnum.Preset+","+CatalogEnum.TransmissionMethod;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/catalogs/GetAllCatalogDetailsWithPaginationByCatalogIdsAsync?catalogIds="+listCatalogIds).then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.transmissionMethodList=data.filter(item=>item.CatalogId==CatalogEnum.TransmissionMethod);
        this.presetList=data.filter(item=>item.CatalogId==CatalogEnum.Preset);
        this.getTranscodeSettings();
      },error=>{
        console.error(error);
      });
    }

    public getAllMainDirectories(){
      this.restProvider.executeSinovadStreamServerService(HttpMethodType.GET,"/directories").then((response) => {
        this.listMainDirectories=JSON.parse(response);
      },error=>{
        console.error(error);
      });
    }

    ngAfterViewInit(){

    }

    public getTranscodeSettings(){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/transcoderSettings/GetByMediaServerAsync/"+this.sharedData.currentMediaServerData.Id).then((response:SinovadApiGenericResponse) => {
        this.currentTranscodeSettings=response.Data;
        if(this.currentTranscodeSettings==undefined)
        {
          var currentTranscodeSettings= new TranscodeSetting();
          currentTranscodeSettings.DirectoryPhysicalPath="";
          currentTranscodeSettings.ConstantRateFactor=18;
          currentTranscodeSettings.TransmissionMethodCatalogId=CatalogEnum.TransmissionMethod;
          currentTranscodeSettings.TransmissionMethodCatalogDetailId=this.transmissionMethodList[0].Id;
          currentTranscodeSettings.PresetCatalogId=CatalogEnum.Preset;
          currentTranscodeSettings.PresetCatalogDetailId=this.presetList[0].Id;
          currentTranscodeSettings.MediaServerId=this.sharedData.currentMediaServerData.Id;
          this.currentTranscodeSettings=currentTranscodeSettings;
        }
      },error=>{
        console.error(error);
      });
    }

    public saveTrancodeSettings(){
      let methodType=this.currentTranscodeSettings.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.currentTranscodeSettings.Id>0?"/transcodeSettings/Update":"/transcodeSettings/Create";
      this.restProvider.executeSinovadApiService(methodType,path,this.currentTranscodeSettings).then((response) => {
        this.showSucessMessage=true;
      },error=>{
        console.error(error);
      });
    }

    public onChangeTransmissionMethod(event:any){
      this.currentTranscodeSettings.TransmissionMethodCatalogDetailId=Number(event.target.value);
    }

    public onChangePreset(event:any){
      this.currentTranscodeSettings.PresetCatalogDetailId=Number(event.target.value);
    }

    public onSaveDirectoryTranscodedVideos(path:string){
      this.currentTranscodeSettings.DirectoryPhysicalPath=path;
      this.showingDirectoryTranscodeVideos=false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }

}
