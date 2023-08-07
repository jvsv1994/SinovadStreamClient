
import { Component, OnInit} from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { CatalogEnum, HttpMethodType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CatalogDetail } from 'src/models/catalogDetail';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from '../shared/components/custom-snack-bar/custom-snack-bar.component';
import { DirectoryChooserPage } from '../shared/components/directory-chooser/directory-chooser.page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MediaServer } from '../servers/shared/server.model';
import { TranscoderSettings } from './transcoder-settings.model';

declare var window;
@Component({
  selector: 'app-transcode-settings',
  templateUrl: './transcode-settings.page.html',
  styleUrls: ['./transcode-settings.page.scss']
})
export class TranscoderSettingssPage implements OnInit {

  transmissionMethodList:CatalogDetail[]=[];
  presetList:CatalogDetail[]=[];
  currentTranscoderSettingss:TranscoderSettings;
  mediaServer:MediaServer;
  loading:boolean=false;
  customForm:FormGroup;

  constructor(
    private modalService: NgbModal,
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public sharedService: SharedDataService) {

    }

    ngOnInit(): void {
      this.getCatalogDetails();
      this.getMediaServerData();
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


    ngAfterViewInit(){

    }

    public async getMediaServerData(){
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetByGuidAsync/'+mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer=response.Data;
        var selectedMediaServer=this.sharedService.mediaServers.find(x=>x.Id==mediaServer.Id);
        mediaServer.isSecureConnection=selectedMediaServer.isSecureConnection;
        this.sharedService.selectedMediaServer=mediaServer;
        this.mediaServer=mediaServer;
        this.getTranscoderSettingss();
      },error=>{
        this.router.navigateByUrl('/404')
      });
    }

    private getTranscoderSettingss(){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/transcoderSettings/GetByMediaServerGuidAsync/"+this.mediaServer.Guid).then((response:SinovadApiGenericResponse) => {
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
        currentTranscoderSettingss.MediaServerId=this.sharedService.selectedMediaServer.Id;
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
        this.snackBarService.showSnackBar("Se guardaron los cambios satisfactoriamente",SnackBarType.Success);
      },error=>{
        this.loading=false;
        this.snackBarService.showSnackBar(error,SnackBarType.Error);
        console.error(error);
      });
    }

    public showChooserDirectoryModal(){
      var ctx=this;
      var ref=this.modalService.open(DirectoryChooserPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.mediaServer=this.sharedService.selectedMediaServer;
      ref.closed.subscribe((directoryPath:string)=>{
        ctx.customForm.controls.temporaryFolder.setValue(directoryPath);
        ctx.customForm.controls.temporaryFolder.markAsDirty();
      })
    }
}
