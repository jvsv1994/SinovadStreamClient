
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Profile } from '../../models/profile';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

declare var window;
@Component({
  selector: 'app-profile-new',
  templateUrl: './profile-new.page.html',
  styleUrls: ['./profile-new.page.scss']
})
export class ProfileNewPage extends ParentComponent implements OnInit {

  @Output() close =new EventEmitter();
  @Output() closeWithChanges =new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;
  @Input() currentTmpProfile:Profile;
  @ViewChild('profileInfoModal') profileInfoModal: ElementRef;
  modalReference:NgbModalRef;
  placeHolder:string="Nombre de Perfil";

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
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


}
