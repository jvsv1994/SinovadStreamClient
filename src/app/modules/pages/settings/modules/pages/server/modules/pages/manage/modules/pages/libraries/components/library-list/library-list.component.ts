
import { Component, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryFormComponent } from '../library-form/library-form.component';
import { CustomMenuItem, CustomMenuService } from 'src/app/modules/shared/services/custom-menu.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { ConfirmDialogOptions, CustomConfirmDialogComponent } from 'src/app/modules/shared/components/custom-confirm-dialog/custom-confirm-dialog.component';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';
import { Library } from '../../models/library.model';
import { LibraryService } from '../../services/library.service';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { SharedDataService } from 'src/app/services/shared-data.service';

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
  loadingConnection:boolean=true;
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;

  constructor(
    private signalIrService:SignalIRHubService,
    private customMenuService:CustomMenuService,
    private modalService: NgbModal,
    private libraryService:LibraryService,
    private dialog: MatDialog,
    private snackBarService:SnackBarService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public sharedDataService: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=true;
          this.loadingConnection=false;
          this.getAllItems();
        }
      });
      this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=false;
        }
      });
    }

    ngOnInit(): void {
      var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
      var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid)
      if(mediaServer)
      {
        this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
        if(mediaServer.isSecureConnection)
        {
          this.loadingConnection=false;
          this.getAllItems();
        }else{
          setTimeout(() => {
            this.loadingConnection=false;
          }, 3000);
        }
      }else{
        this.router.navigateByUrl('/404')
      }
    }

    ngOnDestroy(){
      this.subscriptionEnableMediaServer.unsubscribe();
      this.subscriptionDisableMediaServer.unsubscribe();
    }

    public getAllItems(){
      this.libraryService.getLibrariesByMediaServer(this.mediaServer.Url).then((listLibraries:Library[]) => {
        this.listLibraries=listLibraries;
      },error=>{

      });
    }

    //Show Modal Form Section

    public openNewLibrary(){
      let library= new Library();
      library.MediaServerId=this.mediaServer.Id;
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
      ref.componentInstance.mediaServer=this.mediaServer;
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
      this.libraryService.deleteItem(this.mediaServer.Url,library.Id).then((response:SinovadApiGenericResponse) => {
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
      this.searchFilesInLibraries(listLibraries);
    }
  }

  public updateVideoInAllLibraries(){
    this.searchFilesInLibraries(this.listLibraries);
  }

  public searchFilesInLibraries(listLibraries:Library[]){
    this.libraryService.searchFiles(this.mediaServer.Url,listLibraries);
  }

}
