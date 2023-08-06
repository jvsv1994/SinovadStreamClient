
import { Component, EventEmitter } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import {v4 as uuid} from "uuid";
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { HttpMethodType } from 'src/app/shared/enums';
import { SinovadApiGenericResponse } from '../../response/sinovadApiGenericResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SnackBarService } from '../../shared/services/snack-bar.service';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from '../../shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from '../../shared/components/custom-snack-bar/custom-snack-bar.component';
import { MediaServer } from '../../media-servers/shared/media-server.model';
import { MediaServerService } from 'src/app/media-servers/shared/media-server.service';
import { LibraryService } from '../shared/library.service';
import { Library } from '../shared/library.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryFormComponent } from '../library-form/library-form.component';
import { CustomMenuItem, CustomMenuService } from 'src/app/shared/services/custom-menu.service';

declare var window;
@Component({
  selector: 'app-library-list',
  templateUrl: './library-list.component.html',
  styleUrls: ['./library-list.component.scss']
})
export class LibraryListComponent{

  listLibraries:Library[];
  mediaServer:MediaServer;
  currentLibrary:Library;

  constructor(
    private customMenuService:CustomMenuService,
    private modalService: NgbModal,
    private libraryService:LibraryService,
    private mediaServerService:MediaServerService,
    private dialog: MatDialog,
    private snackBarService:SnackBarService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public restProvider: RestProviderService,
    public sharedData: SharedDataService) {

    }

    ngOnInit(): void {
      this.getMediaServerData();
    }

    public async getMediaServerData(){
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      this.mediaServerService.getMediaServerByGuid(mediaServerGuid).then((response:SinovadApiGenericResponse) => {
        var mediaServer=response.Data;
        var selectedMediaServer=this.sharedData.mediaServers.find(x=>x.Id==mediaServer.Id);
        mediaServer.isSecureConnection=selectedMediaServer.isSecureConnection;
        this.sharedData.selectedMediaServer=mediaServer;
        this.mediaServer=mediaServer;
        this.getAllItems();
      },error=>{
        this.router.navigateByUrl('/404')
      });
    }

    public getAllItems(){
      this.libraryService.getItems(this.mediaServer.Id,1,100,"Id","asc","","").then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.listLibraries=data;
      },error=>{
        console.error(error);
      });
    }

    //Show Modal Form Section

    public openNewLibrary(){
      let library= new Library();
      library.MediaServerId=this.sharedData.selectedMediaServer.Id;
      this.showModalForm(library);
    }

    public editLibrary(library:Library){
      this.showModalForm(JSON.parse(JSON.stringify(library)));
    }

    public showModalForm(library:Library){
      var ctx=this;
      var ref=this.modalService.open(LibraryFormComponent, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.library=library;
      ref.closed.subscribe(x=>{
        ctx.getAllItems();
      })
    }

    public deleteLibrary(library:Library){
      var config = new MatDialogConfig<ConfirmDialogOptions>();
      config.data={
        title:"Eliminar biblioteca",message:"La biblioteca '"+library.Name+"' será eliminada de este servidor. Tus archivos multimedia no se verán afectados. Esto no se puede deshacer. ¿Continuar?",
        accordMessage:"Si, eliminar la biblioteca '"+library.Name+"'"
      }
      this.dialog.open(CustomConfirmDialogComponent,config).afterClosed().subscribe((confirm: boolean) => {
        if (confirm) {
          this.executeDeleteLibrary(library);
        }
      });
    }

    private executeDeleteLibrary(library:Library){
      this.libraryService.deleteItem(library.Id).then((response:SinovadApiGenericResponse) => {
        this.snackBarService.showSnackBar("Se eliminó la biblioteca satisfactoriamente",SnackBarType.Success);
        this.getAllItems();
      },error=>{
        console.error(error);
        this.snackBarService.showSnackBar(error,SnackBarType.Error);
      });
    }




    // actions section

   public showActions(event:any,library:Library){
      this.currentLibrary=library;
      var currentLibrary=JSON.parse(JSON.stringify(library));
      var target=event.currentTarget;
      var listItems:CustomMenuItem[]=[];
      var eventOnEdit:EventEmitter<boolean>=new EventEmitter();
      eventOnEdit.subscribe(res=>{
          this.editLibrary(currentLibrary);
      });
      listItems.push({title:"Editar biblioteca",iconClass:"fa-solid fa-pen-to-square",eventOnSelectItem:eventOnEdit});
      var eventOnSearch:EventEmitter<boolean>=new EventEmitter();
      eventOnSearch.subscribe(res=>{
          this.updateLibraryVideos(currentLibrary);
      });
      listItems.push({title:"Buscar archivos en la biblioteca",iconClass:"fa-solid fa-magnifying-glass-plus",eventOnSelectItem:eventOnSearch});
      var eventOnDelete:EventEmitter<boolean>=new EventEmitter();
      eventOnDelete.subscribe(res=>{
          this.deleteLibrary(currentLibrary);
      });
      listItems.push({title:"Eliminar biblioteca",iconClass:"fa-sharp fa-solid fa-trash",eventOnSelectItem:eventOnDelete});
      this.customMenuService.show({containerId:"sinovadMainContainer",listItems:listItems,target:target}).then(response=>{
        this.currentLibrary=undefined;
      },reject=>{
        this.currentLibrary=undefined;
      });
   }


   // Load libraries videos section

  public updateLibraryVideos(library:Library){
    if(library.Id>0 && library.PhysicalPath!=undefined && library.PhysicalPath!="")
    {
      var listLibraries=[library];
      this.executeUpdateVideosInAllLibrarys(listLibraries);
    }
  }

  public updateVideoInAllLibraries(){
    this.executeUpdateVideosInAllLibrarys(this.listLibraries);
  }

  public executeUpdateVideosInAllLibrarys(listLibraries:Library[]){
    let logIdentifier=uuid();
    let mediaRequest: any={
      ListStorages:listLibraries,
      LogIdentifier:logIdentifier
    };
    this.restProvider.executeSinovadStreamServerService(HttpMethodType.POST,'/medias/UpdateVideosInListStorages',mediaRequest).then((response) => {

    },error=>{
      console.error(error);
    });
  }

}
