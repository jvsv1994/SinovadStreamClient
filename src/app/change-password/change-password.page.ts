
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ChangePasswordModel } from 'src/models/changePasswordModel';

declare var window;
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage extends ParentComponent implements OnInit {


  changePasswordData:ChangePasswordModel= new ChangePasswordModel();
  @Output() closeChangePassword=new EventEmitter();

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }


}
