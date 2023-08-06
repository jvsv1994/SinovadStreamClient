
import { Component, EventEmitter, Output } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';

declare var window;
@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.page.html',
  styleUrls: ['./profiles-view.page.scss']
})
export class ProfilesViewPage{

  enableEditMode:boolean=false;
  showForm:boolean=false;
  currentTmpProfile:Profile;
  showLoading:boolean=true;
  @Output() showProfiles =new EventEmitter();
  @Output() loadedProfiles =new EventEmitter();
  showContent:boolean=false;
  showNewPage:boolean=false;
  _window=window;

  constructor(
    private profileService:ProfileService,
    private router: Router,
    public sharedService: SharedDataService) {

    }

    ngOnInit(): void {
      if(!localStorage.getItem('apiToken'))
      {
        this.router.navigate(['landing'],{ skipLocationChange: false});
      }else{
        this.showContent=true;
        this.getProfiles();
      }
    }

    public changeToEditMode(){
      this.enableEditMode=true;
    }

    public confirmEdit(){
      this.enableEditMode=false;
    }

    public showNewProfile(){
      this.currentTmpProfile={
        FullName:"",
        UserId:this.sharedService.userData.Id
      };
      this.showNewPage=true;
    }

    public editProfile(profile:any){
      this.currentTmpProfile=JSON.parse(JSON.stringify(profile));
      this.showForm=true;
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
      this.sharedService.currentProfile=profile;
      this.router.navigateByUrl("/home");
    }

    public onCloseForm(){
      this.showForm=false;
      this.showNewPage=false;
    }

    public onSaveProfile(){
      this.showForm=false;
      this.showNewPage=false;
      this.getProfiles();
    }

    public getProfiles(){
      this.showLoading=true;
      this.profileService.getProfiles(this.sharedService.userData.Id,1,100,"Id","Asc","","").then((response:SinovadApiGenericResponse) => {
        let listProfiles=response.Data;
        this.sharedService.listProfiles=listProfiles;
        this.sharedService.currentProfile=listProfiles[0];
        this.showProfiles.emit(true);
        this.loadedProfiles.emit(true);
        this.showLoading=false;
      },error=>{
        this.showLoading=false;
      });
    }
}
