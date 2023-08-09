
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LibraryService } from '../shared/library.service';
import { Library } from '../shared/library.model';
import { MyErrorStateMatcher } from 'src/app/shared/custom-error-state-matcher';
import { CatalogEnum } from 'src/app/shared/enums';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { DirectoryChooserPage } from 'src/app/shared/components/directory-chooser/directory-chooser.page';
import { MediaServer } from 'src/app/servers/shared/server.model';

declare var window;
@Component({
  selector: 'app-library-form',
  templateUrl: './library-form.component.html',
  styleUrls: ['./library-form.component.scss']
})
export class LibraryFormComponent implements OnInit {

  @Input() mediaServer:MediaServer;
  @Input() library:Library;
  libraryFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();
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
    private sharedService:SharedService,
    private libraryService:LibraryService,
    private activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private modalService: NgbModal) {

    }

    ngOnInit(): void {
      this.libraryFormGroup = this.formBuilder.group({
        name:new FormControl(this.library.Name,[Validators.required]),
        mediaType: new FormControl(this.library.MediaTypeCatalogDetailId,[Validators.required]),
        physicalPath:new FormControl(this.library.PhysicalPath,[Validators.required])
      });
    }

    public saveStorage(){
      if(this.libraryFormGroup.valid)
      {
        this.showLoading=true;
        var library:Library=JSON.parse(JSON.stringify(this.library));
        library.Name=this.libraryFormGroup.value.name;
        library.MediaTypeCatalogDetailId=Number(this.libraryFormGroup.value.mediaType);
        library.MediaTypeCatalogId=CatalogEnum.MediaType;
        library.PhysicalPath=this.libraryFormGroup.value.physicalPath;
        library.MediaServerId=this.sharedService.selectedMediaServer.Id;
        this.libraryService.saveItem(this.mediaServer.Url,library).then((response) => {
          this.showLoading=false;
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          console.error(error);
        });
      }else{
        this.libraryFormGroup.markAllAsTouched();
      }
    }

    public showChooserDirectoryModal(){
      var ctx=this;
      var ref=this.modalService.open(DirectoryChooserPage, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.mediaServer=this.sharedService.selectedMediaServer;
      ref.closed.subscribe((directoryPath:string)=>{
        ctx.libraryFormGroup.controls.physicalPath.setValue(directoryPath);
      })
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
