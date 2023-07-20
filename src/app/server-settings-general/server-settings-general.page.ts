
import { Component, HostListener, OnInit } from '@angular/core';
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
import { FormBuilder, FormControl, Validators } from '@angular/forms';

declare var window;
@Component({
  selector: 'app-server-setttings-general',
  templateUrl: './server-settings-general.page.html',
  styleUrls: ['./server-settings-general.page.scss']
})
export class ServerSettingsGeneralPage extends ParentComponent implements OnInit {

  customForm = this.formBuilder.group({});
  mediaServer:MediaServer;

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
        this.sharedData.selectedMediaServer=response.Data;
        this.mediaServer=this.sharedData.selectedMediaServer;
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
      var path="/mediaServers/Update";
      var mediaServer=JSON.parse(JSON.stringify(this.mediaServer));
      mediaServer.FamilyName=this.customForm.value.familyName;
      this.restProvider.executeSinovadApiService(HttpMethodType.PUT,path,mediaServer).then((response) => {
        this.getMediaServers();
        this.getMediaServerData();
      },error=>{
        console.error(error);
      });
    }


}
