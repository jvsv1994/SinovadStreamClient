
import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectoryService } from '../../services/directory.service';
import { MediaServer } from 'src/app/servers/shared/server.model';

@Component({
  selector: 'app-directory-chooser',
  templateUrl: './directory-chooser.page.html',
  styleUrls: ['./directory-chooser.page.scss']
})
export class DirectoryChooserPage implements OnInit {

  @Input() mediaServer:MediaServer;
  selectedMainDirectory:any;
  selectedSubdirectory:any;
  listMainDirectories:any[];
  listSubdirectoriesTmp:any=[];

  constructor(
    private directoryService:DirectoryService,
    private activeModal: NgbActiveModal,
    ) {

    }

    ngOnInit(): void {
     this.getDirectories();
    }

    public getDirectories(){
      this.directoryService.getDirectoriesByMediaServer(this.mediaServer.Url).then(response=>{
        this.listMainDirectories=JSON.parse(response);
        let directory=this.listMainDirectories[0];
        this.selectedMainDirectory=directory;
        this.getSubdirectoriesByPath(directory);
      });
    }

    public getSubdirectoriesByPath(directory:any){
      this.directoryService.getSubdirectoriesByMediaServerAndDirectoryPath(this.mediaServer.Url,directory.path).then((response) => {
        this.listSubdirectoriesTmp=JSON.parse(response);
      },error=>{
        console.error(error);
      });
    }

    public saveDirectory(){
      this.activeModal.close(this.getCurrentPath());
    }

    public getCurrentPath(){
      if(this.selectedSubdirectory)
      {
        return this.selectedSubdirectory.path;
      }else{
        return this.selectedMainDirectory.path;
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }


    //Change Directory Section

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

}
