
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from '../shared/components/custom-snack-bar/custom-snack-bar.component';
import { MediaServer } from '../servers/shared/server.model';
import { MediaServerService } from '../servers/shared/server.service';
import { SinovadApiGenericResponse } from '../shared/models/response/sinovad-api-generic-response.model';
import { SignalIRHubService } from '../media/shared/services/signal-ir-hub.service';
import { Subscription } from 'rxjs';

declare var window;
@Component({
  selector: 'app-server-setttings-general',
  templateUrl: './server-settings-general.page.html',
  styleUrls: ['./server-settings-general.page.scss']
})
export class ServerSettingsGeneralPage implements OnInit {

  customForm:FormGroup;
  mediaServer:MediaServer;
  loading:boolean=false;
  loadingConnection:boolean=true;
  subscriptionCompleteConnection:Subscription;

  constructor(
    private signalIrService:SignalIRHubService,
    private serverService: MediaServerService,
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public sharedService: SharedService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscriptionCompleteConnection=this.signalIrService.isCompletedConnection().subscribe((res)=>{
        this.sharedService.hubConnection.on('EnableMediaServer', (mediaServerGuid:string) => {
          if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid)
          {
            this.loadingConnection=false;
          }
        });
      });
    }

    ngOnInit(): void {
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      var mediaServer=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid)
      if(mediaServer)
      {
        this.mediaServer=mediaServer;
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
      this.subscriptionCompleteConnection.unsubscribe();
      if(this.sharedService.hubConnection)
      {
        this.sharedService.hubConnection.off('EnableMediaServer');
      }
    }

    public async getMediaServerData(){
      this.loading=true;
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.serverService.getMediaServerByGuid(mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer:MediaServer=response.Data;
        var ms=this.sharedService.mediaServers.find(x=>x.Guid==mediaServerGuid);
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
      var path="/mediaServers/Update";
      var mediaServer=JSON.parse(JSON.stringify(this.mediaServer));
      mediaServer.FamilyName=this.customForm.value.familyName;
      this.restProvider.executeSinovadApiService(HttpMethodType.PUT,path,mediaServer).then((response) => {
        this.getMediaServerData();
        this.snackBarService.showSnackBar("Se guardaron los cambios satisfactoriamente",SnackBarType.Success);
      },error=>{
        this.loading=false;
        console.error(error);
      });
    }


}
