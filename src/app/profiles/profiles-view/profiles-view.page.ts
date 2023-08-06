
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ParentComponent } from 'src/app/parent/parent.component';
import { Profile } from '../shared/profile.model';

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
  showLoading:boolean=true;
  @Output() showProfiles =new EventEmitter();
  @Output() loadedProfiles =new EventEmitter();
  modalReference:NgbModalRef;
  showModal:boolean=false;
  showNewPage:boolean=false;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      if(!localStorage.getItem('apiToken'))
      {
        this.router.navigate(['landing'],{ skipLocationChange: false});
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
            this.modalReference=this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen',scrollable:true,backdrop: 'static'});
            this.modalReference.shown.subscribe(event => {
              ctx.showProfiles.emit(true);
              ctx.loadedProfiles.emit(true);
              ctx.showLoading=false;
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
      this.modalReference.close();
      this.sharedData.currentProfile=profile;
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
}