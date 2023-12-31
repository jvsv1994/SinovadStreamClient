
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { CatalogEnum } from 'src/app/modules/shared/enums/enums';
import { Library } from '../../models/library.model';
import { LibraryService } from '../../services/library.service';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { DirectoryChooserComponent } from 'src/app/modules/shared/components/directory-chooser/directory-chooser.component';

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
        library.MediaServerId=this.mediaServer.Id;
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
      var ref=this.modalService.open(DirectoryChooserComponent, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.mediaServer=this.mediaServer;
      ref.closed.subscribe((directoryPath:string)=>{
        ctx.libraryFormGroup.controls.physicalPath.setValue(directoryPath);
      })
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
