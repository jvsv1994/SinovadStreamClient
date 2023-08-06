
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Profile } from '../shared/profile.model';
import { ParentComponent } from 'src/app/parent/parent.component';

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
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }
  ngOnInit(): void {

  }

    ngAfterViewInit(){
      this.modalReference=this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen',scrollable:true,backdrop: 'static'});
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

    public onCloseProfileNew(){
      this.modalReference.close();
      this.close.emit(true);
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
