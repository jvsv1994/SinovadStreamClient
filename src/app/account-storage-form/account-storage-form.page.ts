
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../Enums';
import { AccountStorage } from '../models/accountStorage';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


declare var window;
@Component({
  selector: 'app-account-storage-form',
  templateUrl: './account-storage-form.page.html',
  styleUrls: ['./account-storage-form.page.scss']
})
export class AccountStorageFormPage extends ParentComponent implements OnInit,OnDestroy {


  @Input() accountStorage:AccountStorage;
  @Input() listMainDirectories:any[];
  @Output() closeAccountStorageForm=new EventEmitter();;
  @Output() closeAccountStorageFormWithChanges=new EventEmitter();;

  showChooserDirectory:boolean=false;
  @ViewChild('accountStorageModalTarget') accountStorageModalTarget: ElementRef;

  mediaTypes=[
    {
      Id:1,
      Name:"Movies"
    },
    {
      Id:2,
      Name:"Tv Series"
    }
  ]

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(){
      this.modalService.open(this.accountStorageModalTarget,{container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'}).result.then((result) => {
        this.saveAccountStorage();
      }, (reason) => {
        this.closeAccountStorageForm.emit(true);
      });
    }

    public saveAccountStorage(){
      this.accountStorage.AccountServerId=this.sharedData.currentMediaServerData.Id;
      let methodType=this.accountStorage.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.accountStorage.Id>0?"/storages/Update":"/storages/Create";
      this.restProvider.executeSinovadApiService(methodType,path,this.accountStorage).then((response) => {
        this.closeAccountStorageFormWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public onChangeMediaType(event:any){
      this.accountStorage.AccountStorageTypeId=Number(event.target.value);
    }


    ngOnDestroy(){

    }

    public onSelectDirectory(event:any){
      this.accountStorage.PhisicalPath=event;
      this.showChooserDirectory=false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }

}
