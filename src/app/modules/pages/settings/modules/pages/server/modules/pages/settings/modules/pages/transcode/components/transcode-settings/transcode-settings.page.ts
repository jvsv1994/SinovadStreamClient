
import { Component, OnInit} from '@angular/core';
import { CatalogEnum } from 'src/app/modules/shared/enums/enums';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TranscoderSettings } from '../../models/transcoder-settings.model';
import { SignalIRHubService } from 'src/app/modules/shared/services/signal-ir-hub.service';
import { TranscoderSettingsService } from '../../services/transcoderSettings.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { DirectoryChooserPage } from 'src/app/modules/shared/components/directory-chooser/directory-chooser.page';
import { CatalogDetail } from 'src/app/modules/pages/manage/modules/pages/catalogs/shared/catalog-detail.model';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { CatalogService } from 'src/app/modules/pages/manage/modules/pages/catalogs/shared/catalog.services';
import { SharedDataService } from 'src/app/services/shared-data.service';

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
  loadingConnection:boolean=true;
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;

  constructor(
    private catalogService:CatalogService,
    private signalIrService:SignalIRHubService,
    private transcoderSettingsService:TranscoderSettingsService,
    private modalService: NgbModal,
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public sharedDataService: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
          this.mediaServer.isSecureConnection=true;
          this.getTranscoderSettingss();
        }
      });
      this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=false;
        }
      });
    }

    ngOnInit(): void {
      this.getCatalogDetails();
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid)
      if(mediaServer)
      {
        this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
        if(mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
          this.getTranscoderSettingss();
        }else{
          setTimeout(() => {
            this.loadingConnection=false;
          }, 3000);
        }
      }else{
        this.router.navigateByUrl('/404')
      }
    }

    ngOnDestroy(){
      this.subscriptionEnableMediaServer.unsubscribe();
      this.subscriptionDisableMediaServer.unsubscribe();
    }


    public getCatalogDetails(){
      let listCatalogIds=CatalogEnum.TranscoderPreset+","+CatalogEnum.VideoTransmissionType;
      this.catalogService.getAllCatalogDetailsByCatalogIds(listCatalogIds).then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.transmissionMethodList=data.filter(item=>item.CatalogId==CatalogEnum.VideoTransmissionType);
        this.presetList=data.filter(item=>item.CatalogId==CatalogEnum.TranscoderPreset);
      },error=>{
        console.error(error);
      });
    }

    private getTranscoderSettingss(){
      this.transcoderSettingsService.getByMediaServer(this.mediaServer.Url).then((transcoderSettings:TranscoderSettings) => {
      this.currentTranscoderSettingss=transcoderSettings;
        if(this.currentTranscoderSettingss==undefined)
        {
          var currentTranscoderSettingss= new TranscoderSettings();
          currentTranscoderSettingss.TemporaryFolder="";
          currentTranscoderSettingss.ConstantRateFactor=18;
          currentTranscoderSettingss.MediaServerId=this.mediaServer.Id;
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
      this.transcoderSettingsService.saveItem(this.mediaServer.Url,transcoderSettings).then((response) => {
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
      ref.componentInstance.mediaServer=this.mediaServer;
      ref.closed.subscribe((directoryPath:string)=>{
        ctx.customForm.controls.temporaryFolder.setValue(directoryPath);
        ctx.customForm.controls.temporaryFolder.markAsDirty();
      })
    }
}
