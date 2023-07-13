
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Storage } from '../models/storage';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


declare var window;
@Component({
  selector: 'app-storage-form',
  templateUrl: './storage-form.page.html',
  styleUrls: ['./storage-form.page.scss']
})
export class StorageFormPage extends ParentComponent implements OnInit {


  @Input() storage:Storage;
  @Input() listMainDirectories:any[];
  @Output() closeStorageForm=new EventEmitter();;
  @Output() closeStorageFormWithChanges=new EventEmitter();;

  showChooserDirectory:boolean=false;
  @ViewChild('storageModalTarget') storageModalTarget: ElementRef;

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
      this.modalService.open(this.storageModalTarget,{container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'}).result.then((result) => {
        this.saveStorage();
      }, (reason) => {
        this.closeStorageForm.emit(true);
      });
    }

    public saveStorage(){
      this.storage.MediaServerId=this.sharedData.currentMediaServerData.Id;
      let methodType=this.storage.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.storage.Id>0?"/storages/Update":"/storages/Create";
      this.restProvider.executeSinovadApiService(methodType,path,this.storage).then((response) => {
        this.closeStorageFormWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public onChangeMediaType(event:any){
      this.storage.MediaTypeCatalogDetailId=Number(event.target.value);
    }

    public onSelectDirectory(event:any){
      this.storage.PhysicalPath=event;
      this.showChooserDirectory=false;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }

}
