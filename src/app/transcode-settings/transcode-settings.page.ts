
import { Component, OnInit} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { CatalogEnum, HttpMethodType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from '../shared/components/custom-snack-bar/custom-snack-bar.component';
import { DirectoryChooserPage } from '../shared/components/directory-chooser/directory-chooser.page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MediaServer } from '../servers/shared/server.model';
import { CatalogDetail } from '../catalogs/shared/catalog-detail.model';
import { TranscoderSettings } from './shared/transcoder-settings.model';
import { TranscoderSettingsService } from './shared/transcoderSettings.service';

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
    private transcoderSettingsService:TranscoderSettingsService,
    private modalService: NgbModal,
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {

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
        this.mediaServer=mediaServer;
        this.getTranscoderSettingss();
      },error=>{
        this.router.navigateByUrl('/404')
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
      ref.componentInstance.mediaServer=this.sharedService.selectedMediaServer;
      ref.closed.subscribe((directoryPath:string)=>{
        ctx.customForm.controls.temporaryFolder.setValue(directoryPath);
        ctx.customForm.controls.temporaryFolder.markAsDirty();
      })
    }
}
