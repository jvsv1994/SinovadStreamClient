
import { Component} from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile.model';

declare var window;
@Component({
  selector: 'app-profile-new',
  templateUrl: './profile-new.component.html',
  styleUrls: ['./profile-new.component.scss']
})
export class ProfileNewComponent{

  currentTmpProfile:Profile;
  placeHolder:string="Nombre de Perfil";

  constructor(
    private router: Router,
    private sharedDataService:SharedDataService,
    private profileService:ProfileService) {

    }
  ngOnInit(): void {
    this.currentTmpProfile= new Profile();
    this.currentTmpProfile.UserId=this.sharedDataService.userData.Id;
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

    public onCloseProfileNew(){
      this.router.navigateByUrl("/profiles");
    }

}
