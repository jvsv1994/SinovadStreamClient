
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/modules/shared/enums';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

declare var window;
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss']
})
export class ProfileEditPage implements OnInit {

  currentTmpProfile:Profile;
  hideImage:boolean=false;

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    private profileService:ProfileService,
    public restProvider: RestProviderService,
    public sharedService:SharedService) {

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
        this.router.navigateByUrl("/select-profile");
      },error=>{
        console.error(error);
      });
    }

    public onClickDeleteButton(){
      this.profileService.deleteItem(this.currentTmpProfile.Id).then((response) => {
        this.router.navigateByUrl("/select-profile");
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
        var url="/documents/UploadAvatarProfile";
        this.restProvider.executeHttpPostMethodWithFormData(url,formData).then((response: any) => {
          this.restProvider.executeSinovadApiService(HttpMethodType.GET,"/profiles/GetAsync/"+this.currentTmpProfile.Id).then((response: SinovadApiGenericResponse) => {
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
