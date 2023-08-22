
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

  constructor(
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
    }

    ngOnInit(): void {
      this.getMediaServerData();
    }

    public async getMediaServerData(){
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.serverService.getMediaServerByGuid(mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer=response.Data;
        this.mediaServer=mediaServer;
        this.customForm = this.formBuilder.group({
          familyName: new FormControl(this.mediaServer.FamilyName)
        });
      },error=>{
        this.router.navigateByUrl('/404')
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
        this.loading=false;
        this.serverService.getMediaServers();
        this.getMediaServerData();
        this.snackBarService.showSnackBar("Se guardaron los cambios satisfactoriamente",SnackBarType.Success);
      },error=>{
        this.loading=false;
        console.error(error);
      });
    }


}
