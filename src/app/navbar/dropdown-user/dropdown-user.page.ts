
import { ChangeDetectorRef, Component} from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
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
    public sharedService: SharedService) {

    }

  public onClickChangeProfileButton(){
    this.sharedService.showSplashScreen=true;
    this.ref.detectChanges();
    this.router.navigateByUrl('/select-profile')
  }

  public onClickEditProfilesButton(){
    this.sharedService.showSplashScreen=true;
    this.ref.detectChanges();
    this.router.navigateByUrl('/select-profile')
  }

  public onSelectProfile(profile:Profile)
  {
    this.sharedService.currentProfile=profile;
    this.router.navigateByUrl('/home')
  }

  public onClickAccountOption(){
    this.router.navigateByUrl('/settings/account')
  }

  public onClickAdminMode(){
    this.router.navigateByUrl(this.sharedService.listMenus[0].ChildMenus[0].Path)
  }

  public logOut(){
    this.sharedService.currentProfile=undefined;
    this.sharedService.userData=undefined;
    this.sharedService.apiToken=undefined;
    localStorage.removeItem("apiToken");
    this.router.navigateByUrl("/landing");
  }

}
