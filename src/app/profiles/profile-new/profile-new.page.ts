
import { Component} from '@angular/core';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-profile-new',
  templateUrl: './profile-new.page.html',
  styleUrls: ['./profile-new.page.scss']
})
export class ProfileNewPage{

  currentTmpProfile:Profile;
  placeHolder:string="Nombre de Perfil";

  constructor(
    private router: Router,
    private sharedService:SharedDataService,
    private profileService:ProfileService) {

    }
  ngOnInit(): void {
    if(!localStorage.getItem('apiToken'))
    {
      this.router.navigate(['landing'],{ skipLocationChange: false});
    }
    this.currentTmpProfile= new Profile();
    this.currentTmpProfile.UserId=this.sharedService.userData.Id;
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

    public onCloseProfileNew(){
      this.router.navigateByUrl("/select-profile");
    }

    public onClickDeleteButton(){
      this.profileService.deleteItem(this.currentTmpProfile.Id).then((response) => {
        this.router.navigateByUrl("/select-profile");
      },error=>{
        console.error(error);
      });
    }


}
