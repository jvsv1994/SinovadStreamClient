
import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DirectoryService } from '../../services/directory.service';
import { Directory } from '../../models/directory.model';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';

@Component({
  selector: 'app-directory-chooser',
  templateUrl: './directory-chooser.component.html',
  styleUrls: ['./directory-chooser.component.scss']
})
export class DirectoryChooserComponent implements OnInit {

  @Input() mediaServer:MediaServer;
  selectedMainDirectory:Directory;
  selectedSubdirectory:Directory;
  listMainDirectories:Directory[]=[];
  listSubdirectoriesTmp:Directory[]=[];

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

    public getSubdirectoriesByPath(directory:Directory){
      this.directoryService.getSubdirectoriesByMediaServerAndDirectoryPath(this.mediaServer.Url,directory.Path).then((response) => {
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
        return this.selectedSubdirectory.Path;
      }else{
        return this.selectedMainDirectory.Path;
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }


    //Change Directory Section

    public onClickBackFolder(){
      if(this.selectedSubdirectory.ParentDirectory.IsMainDirectory)
      {
        this.selectedSubdirectory=undefined;
        this.getSubdirectoriesByPath(this.selectedMainDirectory);
      }else{
        this.selectedSubdirectory=this.selectedSubdirectory.ParentDirectory;
        this.getSubdirectoriesByPath(this.selectedSubdirectory);
      }
    }

    public onClickMainDirectory(md:Directory)
    {
      this.selectedMainDirectory=md;
      this.getSubdirectoriesByPath(this.selectedMainDirectory);
    }

    public onClickSubDirectory(sd:Directory)
    {
      if(this.selectedSubdirectory==undefined)
      {
        this.selectedSubdirectory=sd;
        this.selectedSubdirectory.ParentDirectory=this.selectedMainDirectory;
      }else{
        let lastSubdirectory=JSON.parse(JSON.stringify(this.selectedSubdirectory))
        this.selectedSubdirectory=sd;
        this.selectedSubdirectory.ParentDirectory=lastSubdirectory;
      }
      this.getSubdirectoriesByPath(this.selectedSubdirectory);
    }

}
