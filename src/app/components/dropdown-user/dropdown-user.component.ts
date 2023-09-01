
import { ChangeDetectorRef, Component} from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { Router } from '@angular/router';
import { Profile } from 'src/app/modules/pages/profiles/shared/profile.model';
import { UserService } from 'src/app/modules/pages/manage/modules/pages/users/services/user.service';

declare var window;
@Component({
  selector: 'app-dropdown-user',
  templateUrl: './dropdown-user.component.html',
  styleUrls: ['./dropdown-user.component.scss']
})
export class DropDownUserComponent{

  constructor(
    private userService:UserService,
    private ref:ChangeDetectorRef,
    private router: Router,
    public sharedService: SharedService) {

    }

  public onClickChangeProfileButton(){
    this.sharedService.showSplashScreen=true;
    this.ref.detectChanges();
    this.router.navigateByUrl('/profiles')
  }

  public onClickEditProfilesButton(){
    this.sharedService.showSplashScreen=true;
    this.ref.detectChanges();
    this.router.navigateByUrl('/profiles')
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
    this.router.navigateByUrl(this.sharedService.manageMenus[0].ChildMenus[0].Path)
  }

  public logOut(){
    this.userService.clearSessionData();
    this.router.navigateByUrl("/landing");
  }

}
