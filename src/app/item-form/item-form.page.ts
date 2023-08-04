
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { TvProgram } from '../../models/tvProgram';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType, MediaType } from 'src/app/shared/enums';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { TvProgramGenre } from '../../models/tvProgramGenre';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { SnackBarType } from '../shared/components/custom-snack-bar/custom-snack-bar.component';
import { Genre } from '../genres/shared/genre.model';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.page.html',
  styleUrls: ['./item-form.page.scss']
})
export class ItemFormPage extends ParentComponent implements OnInit {

  @Input() tvProgram:TvProgram;
  @Input() currentMediaTypeID: number;
  @Output() closeForm=new EventEmitter();;
  @Output() closeFormWithChanges=new EventEmitter();

  showChooserDirectory:boolean=false;
  @ViewChild('modalTarget') modalTarget: ElementRef;
  showGenresPopUp:boolean=false;
  listAllGenresPopUp:Genre[];
  itemForm:FormGroup;

  constructor(
    private snackBarService:SnackBarService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    public isMovie(){
      if(this.currentMediaTypeID==MediaType.Movie)
      {
        return true;
      }else{
        return false;
      }
    }

    public isTvSerie(){
      if(this.currentMediaTypeID==MediaType.TvSerie)
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
      this.itemForm = this.formBuilder.group({
        title: new FormControl(this.tvProgram.Title),
        name:new FormControl(this.tvProgram.Name),
        releaseDate:new FormControl(this.formatDate(this.tvProgram.ReleaseDate)),
        firstAirDate:new FormControl(this.formatDate(this.tvProgram.FirstAirDate)),
        lastAirDate:new FormControl(this.formatDate(this.tvProgram.LastAirDate)),
        directors:new FormControl(this.tvProgram.Directors),
        actors:new FormControl(this.tvProgram.Actors),
        overview:new FormControl(this.tvProgram.Overview),
        posterPath:new FormControl(this.tvProgram.PosterPath)
      });
    }

    ngAfterViewInit(){
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',
      scrollable:true,backdrop:'static'}).result.then((result) => {
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
      if(this.itemForm.valid)
      {
        var tvProgram:TvProgram=JSON.parse(JSON.stringify(this.tvProgram));
        tvProgram.Title=this.itemForm.value.title;
        tvProgram.Name=this.itemForm.value.name;
        tvProgram.ReleaseDate=this.itemForm.value.releaseDate;
        tvProgram.FirstAirDate=this.itemForm.value.firstAirDate;
        tvProgram.LastAirDate=this.itemForm.value.lastAirDate;
        tvProgram.Directors=this.itemForm.value.directors;
        tvProgram.Actors=this.itemForm.value.actors;
        tvProgram.Overview=this.itemForm.value.overview;
        tvProgram.PosterPath=this.itemForm.value.posterPath;
        let movieTypePath=this.currentMediaTypeID==MediaType.Movie?'movies':'tvseries';
        let methodType=this.tvProgram.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
        var path=this.tvProgram.Id>0?"/"+movieTypePath+"/Update":"/"+movieTypePath+"/Create";
        this.restProvider.executeSinovadApiService(methodType,path,tvProgram).then((response) => {
          this.closeFormWithChanges.emit(true);
        },error=>{
          this.snackBarService.showSnackBar(error,SnackBarType.Error);
          console.error(error);
        });
      }else{
        this.itemForm.markAllAsTouched();
      }
    }

    public showListGenresPopUp(){
      this.showGenresPopUp=true;
    }

    public onCloseGenresPopUp(itemGenres:TvProgramGenre[]){
      this.tvProgram.ListItemGenres=itemGenres;
      this.showGenresPopUp=false;
    }
}
