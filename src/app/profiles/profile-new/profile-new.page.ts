
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../shared/profile.model';
import { ProfileService } from '../shared/profile.service';

declare var window;
@Component({
  selector: 'app-profile-new',
  templateUrl: './profile-new.page.html',
  styleUrls: ['./profile-new.page.scss']
})
export class ProfileNewPage{

  @Output() close =new EventEmitter();
  @Output() closeWithChanges =new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;
  @Input() currentTmpProfile:Profile;
  modalReference:NgbModalRef;
  placeHolder:string="Nombre de Perfil";

  constructor(
    private profileService:ProfileService,
    private modalService: NgbModal) {

    }
  ngOnInit(): void {

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

    public onCloseProfileNew(){
      this.modalReference.close();
      this.close.emit(true);
    }

    public onClickDeleteButton(){
      this.profileService.deleteItem(this.currentTmpProfile.Id).then((response) => {
        this.modalReference.close();
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }


}
