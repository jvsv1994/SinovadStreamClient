
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Profile } from '../models/profile';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare var window;
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.page.html',
  styleUrls: ['./profile-form.page.scss']
})
export class ProfileFormPage extends ParentComponent implements OnInit {

  @ViewChild('modalTarget') modalTarget: ElementRef;
  customKeyboardProfileFormEvent:any;
  profileFormContainer: HTMLElement;
  @Input() currentTmpProfile:Profile;
  @Output() close =new EventEmitter();
  @Output() closeWithChanges =new EventEmitter();
  modalReference:NgbModalRef;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    private  ref:ChangeDetectorRef,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnDestroy(){
      this.profileFormContainer.removeEventListener('keydown',this.customKeyboardProfileFormEvent);
    }

    ngAfterViewInit(){
      let ctx=this;
      this.modalReference=this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'});
      this.modalReference.shown.subscribe(event => {
        ctx.initializeProfileFormControls();
      });
    }

    public initializeProfileFormControls(){
      this.profileFormContainer= document.getElementById("profileFormSection");
      if(this.customKeyboardProfileFormEvent)
      {
        this.profileFormContainer.removeEventListener('keydown',this.customKeyboardProfileFormEvent);
      }
      this.focusFullScreenContainer(this.profileFormContainer,this.ref);
      let ctx=this;
      this.customKeyboardProfileFormEvent=function onCustomKeyboardDown(event:any) {
        ctx.setKeyboardActionsFullScreenPage(event,ctx.profileFormContainer,ctx.ref);
      }
      this.profileFormContainer.addEventListener('keydown',this.customKeyboardProfileFormEvent);
    }

    public onChangeProfileName(event:any){
      this.currentTmpProfile.FullName=event.target.value;
    }

    public showKeyboard(input:any){
      input.autofocus=true;
      input.focus();
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

    public closeForm(){
      this.modalReference.close();
      this.close.emit(true);
    }

}
