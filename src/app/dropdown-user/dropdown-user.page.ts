
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Profile } from '../../models/profile';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-dropdown-user',
  templateUrl: './dropdown-user.page.html',
  styleUrls: ['./dropdown-user.page.scss']
})
export class DropDownUserPage extends ParentComponent implements OnInit {

  @Output() showSplashScreen =new EventEmitter();
  @Output() changeProfile =new EventEmitter();
  @Output() logout =new EventEmitter();

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  ngOnInit(): void {
  }

  public onClickAvatarButton(){

  }

  public onClickChangeProfileButton(){
    this.showSplashScreen.emit(true);
    this.router.navigateByUrl('/select-profile')
  }

  public onClickEditProfilesButton(){
    this.showSplashScreen.emit(true);
    this.router.navigateByUrl('/select-profile')
  }

  public onSelectProfile(profile:Profile)
  {
    this.sharedData.currentProfile=profile;
    this.changeProfile.emit(true);
  }

  public onClickAccountOption(){
    this.router.navigateByUrl('/settings/account')
  }

}
