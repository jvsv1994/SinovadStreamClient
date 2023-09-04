
import { Component} from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { CommonService } from 'src/app/services/common.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';

declare var window;
@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.component.html',
  styleUrls: ['./profiles-view.component.scss']
})
export class ProfilesViewComponent{

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
