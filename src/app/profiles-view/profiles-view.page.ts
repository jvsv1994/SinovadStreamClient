
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { Profile } from '../../models/profile';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-profiles-view',
  templateUrl: './profiles-view.page.html',
  styleUrls: ['./profiles-view.page.scss']
})
export class ProfilesViewPage extends ParentComponent implements OnInit {

  @ViewChild('modalTarget') modalTarget: ElementRef;
  enableEditMode:boolean=false;
  showForm:boolean=false;
  currentTmpProfile:Profile;
  @Output() selectProfile =new EventEmitter();
  @Output() showProfiles =new EventEmitter();
  @Output() loadedProfiles =new EventEmitter();
  modalReference:NgbModalRef;
  showModal:boolean=false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      if(!localStorage.getItem('apiKey'))
      {
        this.router.navigate([this.sharedData.platform,'landing'],{ skipLocationChange: false});
      }else{
        this.showModal=true;
        this.performGetProfiles();
      }
    }

    ngAfterViewInit(){

    }


    ngOnDestroy(){

    }

    public performGetProfiles(): Promise<any>{
      return new Promise((resolve, reject) => {
        this.getProfiles().then(response => {
          if(this.showModal)
          {
            let ctx=this;
            this.modalReference=this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'});
            this.modalReference.shown.subscribe(event => {
              ctx.showProfiles.emit(true);
              ctx.loadedProfiles.emit(true);
            });
          }
          resolve(true);
        },error=>{
          reject(error);
        });
      });
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
        UserId:this.sharedData.userData.Id
      };
      this.showForm=true;
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
      this.modalReference.close();
      this.selectProfile.emit(profile);
    }

    public onCloseForm(){
      this.showForm=false;
    }

    public onSaveProfile(){
      this.showForm=false;
      this.getProfiles();
    }
}
