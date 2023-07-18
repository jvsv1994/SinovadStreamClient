
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Profile } from '../../models/profile';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';

declare var window;
@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss']
})
export class ProfileEditPage extends ParentComponent implements OnInit {

  @Output() close =new EventEmitter();
  @Output() closeWithChanges =new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;
  @Input() currentTmpProfile:Profile;
  @ViewChild('profileInfoModal') profileInfoModal: ElementRef;
  modalReference:NgbModalRef;
  hideImage:boolean=false;

  constructor(
    private ref:ChangeDetectorRef,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngAfterViewInit(){
      this.modalReference=this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'});
    }

    public saveProfile(){
      let methodType=this.currentTmpProfile.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.currentTmpProfile.Id>0?'/profiles/Update':'/profiles/Create';
      this.restProvider.executeSinovadApiService(methodType,path,this.currentTmpProfile).then((response) => {
        this.modalReference.close();
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public onClickDeleteButton(){
      this.restProvider.executeSinovadApiService(HttpMethodType.DELETE,'/profiles/Delete/'+this.currentTmpProfile.Id).then((response) => {
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
