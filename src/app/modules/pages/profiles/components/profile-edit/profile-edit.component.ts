
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { CommonService } from 'src/app/services/common.service';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';

declare var window;
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  currentTmpProfile:Profile;
  hideImage:boolean=false;

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    private profileService:ProfileService,
    public commonService: CommonService,
    public sharedDataService:SharedDataService) {

    }

    ngOnInit():void{
      var profileGuid=this.activeRoute.snapshot.params.profileGuid;
      this.profileService.getProfileByGuid(profileGuid).then((response:SinovadApiGenericResponse)=>{
        if(response.Data==null)
        {
          this.router.navigateByUrl('404');
        }
        this.currentTmpProfile=response.Data;
      },error=>{
        this.router.navigateByUrl('404');
      });
    }

    ngAfterViewInit(){

    }

    public saveProfile(){
      this.profileService.saveItem(this.currentTmpProfile).then((response) => {
        this.router.navigateByUrl("/profiles");
      },error=>{
        console.error(error);
      });
    }

    public onClickDeleteButton(){
      this.profileService.deleteItem(this.currentTmpProfile.Id).then((response) => {
        this.router.navigateByUrl("/profiles");
      },error=>{
        console.error(error);
      });
    }

    public uploadAvatarImage(event:any){
      if(event.target.files && event.target.files.length>0)
      {
        let file:File =event.target.files[0];
        var formData = new FormData();
        formData.append("ProfileId",this.currentTmpProfile.Id.toString());
        formData.append('File', file, file.name);
        this.profileService.uploadAvatarProfile(formData).then((response: any) => {
          this.profileService.getProfileById(this.currentTmpProfile.Id).then((response: SinovadApiGenericResponse) => {
             this.currentTmpProfile=response.Data;
             this.hideImage=true;
             setTimeout(() => {
              this.hideImage=false;
             }, 0);
          },error=>{
            console.error(error);
          });
        },error=>{
          console.error(error);
        });
      }
    }

}
