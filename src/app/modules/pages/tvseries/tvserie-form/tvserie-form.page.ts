
import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TvSerie } from '../shared/tvserie.model';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { TvSerieService } from '../shared/tvserie.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { GenresSelectionModalComponent } from 'src/app/modules/pages/genres/genres-selection-modal/genres-selection-modal.component';
import { GenreService } from 'src/app/modules/pages/genres/shared/genre.service';
import { Genre } from 'src/app/modules/pages/genres/shared/genre.model';
import { SelectionModel } from '@angular/cdk/collections';
import { TvSerieGenre } from '../shared/tvserie-genre.model';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

@Component({
  selector: 'app-tvserie-form',
  templateUrl: './tvserie-form.page.html',
  styleUrls: ['./tvserie-form.page.scss']
})
export class TvSerieFormPage implements OnInit{

  @Input() tvserie:TvSerie;
  listTvSeries:TvSerie[];
  tvserieFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();
  listGenres:Genre[];

  constructor(
    private sharedService:SharedService,
    private modalService: NgbModal,
    private genreService:GenreService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private tvserieService:TvSerieService) {

    }

    //Initialize Data

    ngOnInit(): void {
      this.buildFormGroup();
      this.genreService.getAllGenres().then((response:SinovadApiGenericResponse)=>{
        this.listGenres=response.Data;
      })
      if(this.tvserie.Id>0)
      {
        this.getTvSerie();
      }else{
        this.tvserie.ListItemGenres=[];
      }
    }

    //Build Form Group

    private buildFormGroup(){
      this.tvserieFormGroup = this.formBuilder.group({
        name:new FormControl(this.tvserie.Name,[Validators.required]),
        firstAirDate:new FormControl(this.sharedService.formatDate(this.tvserie.FirstAirDate)),
        lastAirDate:new FormControl(this.sharedService.formatDate(this.tvserie.LastAirDate)),
        directors:new FormControl(this.tvserie.Directors),
        actors:new FormControl(this.tvserie.Actors),
        overview:new FormControl(this.tvserie.Overview),
        posterPath:new FormControl(this.tvserie.PosterPath),
        selectedGenres:new FormControl("")
      });
    }


    //Get TvSerie

    private getTvSerie(){
      this.tvserieService.getTvSerie(this.tvserie.Id).then((response:SinovadApiGenericResponse)=>{
        this.tvserie=response.Data;
        this.tvserieFormGroup.controls['selectedGenres'].patchValue(this.getSelectedGenres());
      })
    }

    //Save

    public saveItem(){
      if(this.tvserieFormGroup.valid)
      {
        this.showLoading=true;
        var tvserie:TvSerie=JSON.parse(JSON.stringify(this.tvserie));
        tvserie.Name=this.tvserieFormGroup.value.name;
        tvserie.FirstAirDate=this.tvserieFormGroup.value.firstAirDate;
        tvserie.LastAirDate=this.tvserieFormGroup.value.lastAirDate;
        tvserie.Directors=this.tvserieFormGroup.value.directors;
        tvserie.Actors=this.tvserieFormGroup.value.actors;
        tvserie.Overview=this.tvserieFormGroup.value.overview;
        this.tvserieService.saveItem(tvserie).then((response: any) => {
          this.showLoading=false;
          this.snackbarService.showSnackBar("Se guardo la serie satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          console.error(error);
        });
      }else{
        this.tvserieFormGroup.markAllAsTouched();
      }
    }

    //Close Modal

    public closeModal(){
      this.activeModal.dismiss();
    }

    //TvSerie Genres Section

    private getSelectedGenres():string{
      if(this.tvserie.ListItemGenres && this.tvserie.ListItemGenres.length>0)
      {
        var listGenres = this.tvserie.ListItemGenres.map(a => a.GenreName);
        return listGenres.join(", ");
      }
      return "";
    }

    public showGenresSelectionModal(){
      var ctx=this;
      var ref=this.modalService.open(GenresSelectionModalComponent, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.listAllGenres=this.listGenres;
      ref.componentInstance.selection= new SelectionModel<Genre>(true, this.getTvSerieGenres());
      ref.closed.subscribe((selectedGenres:Genre[])=>{
        ctx.setTvSerieGenres(selectedGenres);
      })
    }

    private getTvSerieGenres():Genre[]{
      var listGenreIds = this.tvserie.ListItemGenres.map(a => a.GenreId);
      return this.listGenres.filter(g=>listGenreIds.indexOf(g.Id)!=-1);
    }

    private setTvSerieGenres(genres:Genre[]):void{
      var tvserieGenres:TvSerieGenre[]=[];
      genres.forEach(genre => {
        tvserieGenres.push({TvSerieId:this.tvserie.Id,GenreId:genre.Id,GenreName:genre.Name});
      });
      this.tvserie.ListItemGenres=tvserieGenres;
      this.tvserieFormGroup.controls['selectedGenres'].patchValue(this.getSelectedGenres());
    }


}