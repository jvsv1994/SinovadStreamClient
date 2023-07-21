
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { CatalogEnum, HttpMethodType } from '../enums';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { TranscoderSettings } from '../../models/transcoderSettings';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaServer } from 'src/models/mediaServer';
import { CustomToastPage } from '../custom-toast/custom-toast.page';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogDetail } from 'src/models/catalogDetail';
import { ToastType } from '../custom-toast/toastEnums';

declare var window;
@Component({
  selector: 'app-transcode-settings',
  templateUrl: './transcode-settings.page.html',
  styleUrls: ['./transcode-settings.page.scss']
})
export class TranscoderSettingssPage extends ParentComponent implements OnInit {


  listMainDirectories:any[];

  showingDirectoryMovies:boolean;
  directoryMovies:string="";

  showingDirectoryTVSeries:boolean;
  directoryTvSeries:string="";

  showingDirectoryTranscodeVideos:boolean;

  transmissionMethodList:CatalogDetail[]=[];
  presetList:CatalogDetail[]=[];
  currentTranscoderSettingss:TranscoderSettings;
  mediaServer:MediaServer;
  loading:boolean=false;
  customForm:FormGroup;
  @ViewChild('customToastPage') customToastPage: CustomToastPage;

  constructor(
    private formBuilder: FormBuilder,
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
      this.getAllMainDirectories();
      this.getCatalogDetails();
      this.getMediaServerData();
    }

    public async getMediaServerData(){
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetByGuidAsync/'+mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        this.sharedData.selectedMediaServer=response.Data;
        this.mediaServer=this.sharedData.selectedMediaServer;
        this.getTranscoderSettingss();
      },error=>{
        this.router.navigateByUrl('/404')
      });
    }

    public getCatalogDetails(){
      let listCatalogIds=CatalogEnum.TranscoderPreset+","+CatalogEnum.VideoTransmissionType;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/catalogs/GetAllCatalogDetailsWithPaginationByCatalogIdsAsync?catalogIds="+listCatalogIds).then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.transmissionMethodList=data.filter(item=>item.CatalogId==CatalogEnum.VideoTransmissionType);
        this.presetList=data.filter(item=>item.CatalogId==CatalogEnum.TranscoderPreset);
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

    private getTranscoderSettingss(){
        var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
        if(this.validateMediaServer(mediaServerGuid)){
          this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/transcoderSettings/GetByMediaServerGuidAsync/"+mediaServerGuid).then((response:SinovadApiGenericResponse) => {
            this.currentTranscoderSettingss=response.Data;
            if(this.currentTranscoderSettingss==undefined)
            {
              var currentTranscoderSettingss= new TranscoderSettings();
              currentTranscoderSettingss.TemporaryFolder="";
              currentTranscoderSettingss.ConstantRateFactor=18;
              currentTranscoderSettingss.VideoTransmissionTypeCatalogId=CatalogEnum.VideoTransmissionType;
              currentTranscoderSettingss.VideoTransmissionTypeCatalogDetailId=this.transmissionMethodList[0].Id;
              currentTranscoderSettingss.PresetCatalogId=CatalogEnum.TranscoderPreset;
              currentTranscoderSettingss.PresetCatalogDetailId=this.presetList[0].Id;
              currentTranscoderSettingss.MediaServerId=this.sharedData.selectedMediaServer.Id;
              this.currentTranscoderSettingss=currentTranscoderSettingss;
            }
            this.customForm = this.formBuilder.group({
              temporaryFolder: new FormControl(this.currentTranscoderSettingss.TemporaryFolder),
              preset:new FormControl(this.currentTranscoderSettingss.PresetCatalogDetailId),
              transmissionMethod:new FormControl(this.currentTranscoderSettingss.VideoTransmissionTypeCatalogDetailId),
              constantRateFactor:new FormControl(this.currentTranscoderSettingss.ConstantRateFactor)
            });
          },error=>{
            console.error(error);
          });
        }else{
          this.router.navigateByUrl('/404')
        }
    }

    public onSaveDirectoryTranscodedVideos(path:string){
      this.currentTranscoderSettingss.TemporaryFolder=path;
      this.showingDirectoryTranscodeVideos=false;
    }

    public saveTranscoder(){
      this.loading=true;
      var transcoderSettings:TranscoderSettings=JSON.parse(JSON.stringify(this.currentTranscoderSettingss));
      transcoderSettings.TemporaryFolder=this.customForm.value.temporaryFolder;
      transcoderSettings.ConstantRateFactor=this.customForm.value.constantRateFactor;
      transcoderSettings.VideoTransmissionTypeCatalogDetailId=this.customForm.value.transmissionMethod;
      transcoderSettings.PresetCatalogDetailId=this.customForm.value.preset;
      let methodType=this.currentTranscoderSettingss.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.currentTranscoderSettingss.Id>0?"/transcoderSettings/Update":"/transcoderSettings/Create";
      this.restProvider.executeSinovadApiService(methodType,path,transcoderSettings).then((response) => {
        this.loading=false;
        this.getTranscoderSettingss();
        this.customToastPage.show({containerId:"sinovadMainContainer",displayTime:2000,message:"Se guardaron los cambios satisfactoriamente",toastType:ToastType.Success});
      },error=>{
        this.loading=false;
        console.error(error);
      });
    }

}
