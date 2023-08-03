
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { HttpMethodType } from 'src/app/shared/enums';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaServer } from 'src/models/mediaServer';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from '../shared/components/custom-snack-bar/custom-snack-bar.component';

declare var window;
@Component({
  selector: 'app-server-setttings-general',
  templateUrl: './server-settings-general.page.html',
  styleUrls: ['./server-settings-general.page.scss']
})
export class ServerSettingsGeneralPage extends ParentComponent implements OnInit {

  customForm:FormGroup;
  mediaServer:MediaServer;
  loading:boolean=false;

  constructor(
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    ngOnInit(): void {
      this.getMediaServerData();
    }

    public async getMediaServerData(){
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/mediaServers/GetByGuidAsync/'+mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer=response.Data;
        var selectedMediaServer=this.sharedData.mediaServers.find(x=>x.Id==mediaServer.Id);
        mediaServer.isSecureConnection=selectedMediaServer.isSecureConnection;
        this.sharedData.selectedMediaServer=mediaServer;
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
        this.getMediaServers();
        this.getMediaServerData();
        this.snackBarService.showSnackBar("Se guardaron los cambios satisfactoriamente",SnackBarType.Success);
      },error=>{
        this.loading=false;
        console.error(error);
      });
    }


}
