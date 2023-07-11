
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { TvProgram } from '../models/tvProgram';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType, ItemType } from '../Enums';
import { Genre } from '../models/genre';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { TvProgramGenre } from '../models/tvProgramGenre';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.page.html',
  styleUrls: ['./item-form.page.scss']
})
export class ItemFormPage extends ParentComponent implements OnInit {

  @Input() tvProgram:TvProgram;
  @Input() currentItemTypeID: number;
  @Output() closeForm=new EventEmitter();;
  @Output() closeFormWithChanges=new EventEmitter();

  showChooserDirectory:boolean=false;
  @ViewChild('modalTarget') modalTarget: ElementRef;
  showGenresPopUp:boolean=false;
  listAllGenresPopUp:Genre[];

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    public isMovie(){
      if(this.currentItemTypeID==ItemType.Movie)
      {
        return true;
      }else{
        return false;
      }
    }

    public isTvSerie(){
      if(this.currentItemTypeID==ItemType.TvSerie)
      {
        return true;
      }else{
        return false;
      }
    }

    public getSelectedGenres():string{
      if(this.tvProgram.ListItemGenres && this.tvProgram.ListItemGenres.length>0)
      {
        var listGenres = this.tvProgram.ListItemGenres.map(a => a.GenreName);
        return listGenres.join(", ");
      }
      return "";
    }

    ngOnInit(): void {
      this.getGenres();
    }

    ngAfterViewInit(){
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'}).result.then((result) => {
        this.saveItem();
      }, (reason) => {
        this.closeForm.emit(true);
      });
    }

    public getGenres(){
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,'/genres/GetAllAsync').then((response:SinovadApiGenericResponse) => {
        let data=response.Data;
        this.listAllGenresPopUp=data;
      },error=>{
        console.error(error);
      });
    }

    public saveItem(){
      if(this.currentItemTypeID==ItemType.Movie)
      {
        this.saveMovie();
      }
      if(this.currentItemTypeID==ItemType.TvSerie)
      {
        this.saveTvSerie();
      }
    }

    public saveMovie(){
      let body: any=this.tvProgram;
      let methodType=this.tvProgram.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.tvProgram.Id>0?"/movies/Update":"/movies/Create";
      this.restProvider.executeSinovadApiService(methodType,path,body).then((response) => {
        this.closeFormWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public saveTvSerie(){
      let body: any=this.tvProgram;
      let methodType=this.tvProgram.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      var path=this.tvProgram.Id>0?"/tvseries/Update":"/tvseries/Create";
      this.restProvider.executeSinovadApiService(methodType,path,body).then((response) => {
        this.closeFormWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public showListGenresPopUp(){
      this.showGenresPopUp=true;
    }

    public onCloseGenresPopUp(itemGenres:TvProgramGenre[]){
      this.tvProgram.ListItemGenres=itemGenres;
      this.showGenresPopUp=false;
    }
}
