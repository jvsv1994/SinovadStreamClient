
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import hiBase64 from 'hi-base64';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-directory-chooser',
  templateUrl: './directory-chooser.page.html',
  styleUrls: ['./directory-chooser.page.scss']
})
export class DirectoryChooserPage extends ParentComponent implements OnInit {

  selectedMainDirectory:any;
  selectedSubdirectory:any;
  @Input() listMainDirectories:any[];
  listSubdirectoriesTmp:any=[];
  @Output() outputSelectedSubdirectory=new EventEmitter();;
  @Output() closeChooserDirectory=new EventEmitter();;
  @ViewChild('directoryChooserModelTarget') directoryChooserModelTarget: ElementRef;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      let directory=this.listMainDirectories[0];
      this.selectedMainDirectory=directory;
      this.getSubdirectoriesByPath(directory);
    }

    ngAfterViewInit(){
      this.modalService.open(this.directoryChooserModelTarget, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',
      ariaLabelledBy: 'modal-basic-title',backdrop: 'static'}).result.then((result) => {
        this.saveDirectory();
      }, (reason) => {
        this.closeChooserDirectory.emit(true);
      });
    }

    public saveDirectory(){
      this.outputSelectedSubdirectory.emit(this.getCurrentPath());
    }

    public getCurrentPath(){
      if(this.selectedSubdirectory)
      {
        return this.selectedSubdirectory.path;
      }else{
        return this.selectedMainDirectory.path;
      }
    }

    public onClickBackFolder(){
      if(this.selectedSubdirectory.parentDirectory.isMainDirectory)
      {
        this.selectedSubdirectory=undefined;
        this.getSubdirectoriesByPath(this.selectedMainDirectory);
      }else{
        this.selectedSubdirectory=this.selectedSubdirectory.parentDirectory;
        this.getSubdirectoriesByPath(this.selectedSubdirectory);
      }
    }

    public onClickMainDirectory(md:any)
    {
      this.selectedMainDirectory=md;
      this.getSubdirectoriesByPath(this.selectedMainDirectory);
    }

    public onClickSubDirectory(sd:any)
    {
      if(this.selectedSubdirectory==undefined)
      {
        this.selectedSubdirectory=sd;
        this.selectedSubdirectory.parentDirectory=this.selectedMainDirectory;
      }else{
        let lastSubdirectory=JSON.parse(JSON.stringify(this.selectedSubdirectory))
        this.selectedSubdirectory=sd;
        this.selectedSubdirectory.parentDirectory=lastSubdirectory;
      }
      this.getSubdirectoriesByPath(this.selectedSubdirectory);
    }

    public getSubdirectoriesByPath(directory:any){
      var base64Path=hiBase64.encode(directory.path);
      this.restProvider.executeSinovadStreamServerService(HttpMethodType.GET,"/directories/"+base64Path).then((response) => {
        this.listSubdirectoriesTmp=JSON.parse(response);
      },error=>{
        console.error(error);
      });
    }

}
