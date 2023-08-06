
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../shared/profile.model';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { ProfileService } from '../shared/profile.service';

declare var window;
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss']
})
export class ProfileEditPage {

  @Output() close =new EventEmitter();
  @Output() closeWithChanges =new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;
  @Input() currentTmpProfile:Profile;
  modalReference:NgbModalRef;
  hideImage:boolean=false;

  constructor(
    private profileService:ProfileService,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public sharedDataService:SharedDataService) {

    }

    ngAfterViewInit(){
      this.modalReference=this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen',scrollable:true,backdrop: 'static'});
    }

    public saveProfile(){
      this.profileService.saveItem(this.currentTmpProfile).then((response) => {
        this.modalReference.close();
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public onClickDeleteButton(){
      this.profileService.deleteItem(this.currentTmpProfile.Id).then((response) => {
        this.modalReference.close();
        this.closeWithChanges.emit(true);
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
