
import { Component} from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { CommonService } from 'src/app/services/common.service';

declare var window;
@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.page.html',
  styleUrls: ['./profiles-view.page.scss']
})
export class ProfilesViewPage{

  enableEditMode:boolean=false;
  showLoading:boolean=true;
  _window=window;

  constructor(
    private profileService:ProfileService,
    private router: Router,
    public commonService: CommonService,
    public sharedDataService: SharedDataService) {

    }

    ngOnInit(): void {
      this.getProfiles();
    }

    public changeToEditMode(){
      this.enableEditMode=true;
    }

    public confirmEdit(){
      this.enableEditMode=false;
    }

    public showNewProfile(){
      this.router.navigateByUrl("/profiles/add");
    }

    public editProfile(profile:Profile){
      this.router.navigateByUrl("/profiles/edit/"+profile.Guid);
    }

    public onSelectProfile(profile:any){
      if(this.enableEditMode)
      {
        this.editProfile(profile);
      }else{
        this.enterProfile(profile);
      }
    }

    public enterProfile(profile:any){
      this.sharedDataService.currentProfile=profile;
      this.router.navigateByUrl("/home");
    }

    public getProfiles(){
      this.showLoading=true;
      this.profileService.getProfiles(this.sharedDataService.userData.Id,1,100,"Id","asc","","").then((response:SinovadApiGenericResponse) => {
        let listProfiles=response.Data;
        this.sharedDataService.listProfiles=listProfiles;
        this.sharedDataService.currentProfile=listProfiles[0];
        this.showLoading=false;
      },error=>{
        this.showLoading=false;
      });
    }
}
