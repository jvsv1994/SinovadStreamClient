
import { ChangeDetectorRef, Component} from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';
import { Profile } from '../../profiles/shared/profile.model';

declare var window;
@Component({
  selector: 'app-dropdown-user',
  templateUrl: './dropdown-user.page.html',
  styleUrls: ['./dropdown-user.page.scss']
})
export class DropDownUserPage{

  constructor(
    private ref:ChangeDetectorRef,
    private router: Router,
    public sharedData: SharedDataService) {

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
    this.router.navigateByUrl('/home')
  }

  public onClickAccountOption(){
    this.router.navigateByUrl('/settings/account')
  }

  public onClickAdminMode(){
    this.router.navigateByUrl(this.sharedData.listMenus[0].ChildMenus[0].Path)
  }

  public logOut(){
    this.sharedData.currentProfile=undefined;
    this.sharedData.userData=undefined;
    this.sharedData.apiToken=undefined;
    localStorage.removeItem("apiToken");
    this.router.navigateByUrl("/landing");
  }

}
