
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
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

  @Output() showAdminMode =new EventEmitter();
  @Output() changeProfile =new EventEmitter();
  @Output() logout =new EventEmitter();

  constructor(
    private ref:ChangeDetectorRef,
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

  ngOnInit(): void {
  }

  public onClickChangeProfileButton(){
    this.sharedData.showSplashScreen=true;
    this.ref.detectChanges();
    this.router.navigateByUrl('/select-profile')
  }

  public onClickEditProfilesButton(){
    this.sharedData.showSplashScreen=true;
    this.ref.detectChanges();
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

  public onClickAdminMode(){
    this.router.navigateByUrl(this.sharedData.listMenus[0].ChildMenus[0].Path)
  }

}
