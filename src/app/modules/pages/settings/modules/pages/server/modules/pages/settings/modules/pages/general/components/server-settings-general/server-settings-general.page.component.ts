
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { Subscription } from 'rxjs';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { MediaServerService } from 'src/app/modules/pages/manage/modules/pages/servers/services/server.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-server-setttings-general-page',
  templateUrl: './server-settings-general-page.component.html',
  styleUrls: ['./server-settings-general-page.component.scss']
})
export class ServerSettingsGeneralPageComponent implements OnInit {

  customForm:FormGroup;
  mediaServer:MediaServer;
  loading:boolean=false;
  loadingConnection:boolean=true;
  subscription:Subscription= new Subscription();

  constructor(
    private signalIrService:SignalIRHubService,
    private serverService: MediaServerService,
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public sharedDataService: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscription.add(this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
          this.mediaServer.isSecureConnection=true;
        }
      }));
      this.subscription.add(this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=false;
        }
      }));
    }

    ngOnInit(): void {
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid)
      if(mediaServer)
      {
        this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
        if(mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
        }else{
          setTimeout(() => {
            this.loadingConnection=false;
          }, 3000);
        }
        this.customForm = this.formBuilder.group({
          familyName: new FormControl(this.mediaServer.FamilyName)
        });
      }else{
        this.router.navigateByUrl('/404')
      }
    }

    ngOnDestroy(){
      this.subscription.unsubscribe();
    }

    public async getMediaServerData(){
      this.loading=true;
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.serverService.getMediaServerByGuid(mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer:MediaServer=response.Data;
        var ms=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid);
        var mediaServerUpdated=ms;
        mediaServerUpdated.FamilyName=mediaServer.FamilyName;
        this.mediaServer=mediaServerUpdated;
        this.customForm = this.formBuilder.group({
          familyName: new FormControl(this.mediaServer.FamilyName)
        });
        this.loading=false;
      },error=>{
        this.router.navigateByUrl('/404');
        this.loading=false;
      });
    }

    ngAfterViewInit(){

    }

    public updateMediaServer(){
      this.loading=true;
      var mediaServer=JSON.parse(JSON.stringify(this.mediaServer));
      mediaServer.FamilyName=this.customForm.value.familyName;
      this.serverService.saveItem(mediaServer).then((response) => {
        this.getMediaServerData();
        this.snackBarService.showSnackBar("Se guardaron los cambios satisfactoriamente",SnackBarType.Success);
      },error=>{
        this.loading=false;
        console.error(error);
      });
    }

}
