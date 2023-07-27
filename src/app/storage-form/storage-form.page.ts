
import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { HttpMethodType } from '../enums';
import { Storage } from '../../models/storage';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


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
  libraryForm:FormGroup;

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
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.libraryForm = this.formBuilder.group({
        name:new FormControl(this.storage.Name),
        mediaType: new FormControl(this.storage.MediaTypeCatalogDetailId),
        physicalPath:new FormControl(this.storage.PhysicalPath)
      });
    }

    ngAfterViewInit(){
      this.modalService.open(this.storageModalTarget,{container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'}).result.then((result) => {
        this.saveStorage();
      }, (reason) => {
        this.closeStorageForm.emit(true);
      });
    }

    public saveStorage(){
      if(this.libraryForm.valid)
      {
        var storage:Storage=JSON.parse(JSON.stringify(this.storage));
        storage.Name=this.libraryForm.value.name;
        storage.MediaTypeCatalogDetailId=this.libraryForm.value.mediaType;
        storage.PhysicalPath=this.libraryForm.value.physicalPath;
        storage.MediaServerId=this.sharedData.selectedMediaServer.Id;
        let methodType=this.storage.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
        var path=this.storage.Id>0?"/storages/Update":"/storages/Create";
        this.restProvider.executeSinovadApiService(methodType,path,storage).then((response) => {
          this.closeStorageFormWithChanges.emit(true);
        },error=>{
          console.error(error);
        });
      }else{
        this.libraryForm.markAllAsTouched();
      }
    }

    public onChangeMediaType(event:any){
      this.storage.MediaTypeCatalogDetailId=Number(event.target.value);
    }

    public onSelectDirectory(event:any){
      this.libraryForm.controls.physicalPath.setValue(event);
      this.showChooserDirectory=false;
    }

    public showChooserDirectoryModal(){
      if(this.listMainDirectories && this.listMainDirectories.length>0)
      {
        this.showChooserDirectory=true;
      }
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {

    }

}
