
import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { SelectionModel } from '@angular/cdk/collections';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { TvSerie } from '../../models/tvserie.model';
import { Genre } from '../../../genres/models/genre.model';
import { GenreService } from '../../../genres/services/genre.service';
import { TvSerieService } from '../../services/tvserie.service';
import { GenresSelectionModalComponent } from '../../../genres/components/genres-selection-modal/genres-selection-modal.component';
import { TvSerieGenre } from '../../models/tvserie-genre.model';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-tvserie-form',
  templateUrl: './tvserie-form.component.html',
  styleUrls: ['./tvserie-form.component.scss']
})
export class TvSerieFormComponent implements OnInit{

  @Input() tvserie:TvSerie;
  listTvSeries:TvSerie[];
  tvserieFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();
  listGenres:Genre[];

  constructor(
    public commonService: CommonService,
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
        this.tvserie.TvSerieGenres=[];
      }
    }

    //Build Form Group

    private buildFormGroup(){
      this.tvserieFormGroup = this.formBuilder.group({
        name:new FormControl(this.tvserie.Name,[Validators.required]),
        firstAirDate:new FormControl(this.commonService.formatDate(this.tvserie.FirstAirDate)),
        lastAirDate:new FormControl(this.commonService.formatDate(this.tvserie.LastAirDate)),
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
        tvserie.GenresIds=this.tvserie.TvSerieGenres.map(mg=>mg.GenreId);
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
      if(this.tvserie.TvSerieGenres && this.tvserie.TvSerieGenres.length>0)
      {
        var listGenres = this.tvserie.TvSerieGenres.map(a => a.GenreName);
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
      var listGenreIds = this.tvserie.TvSerieGenres.map(a => a.GenreId);
      return this.listGenres.filter(g=>listGenreIds.indexOf(g.Id)!=-1);
    }

    private setTvSerieGenres(genres:Genre[]):void{
      var tvserieGenres:TvSerieGenre[]=[];
      genres.forEach(genre => {
        tvserieGenres.push({TvSerieId:this.tvserie.Id,GenreId:genre.Id,GenreName:genre.Name});
      });
      this.tvserie.TvSerieGenres=tvserieGenres;
      this.tvserieFormGroup.controls['selectedGenres'].patchValue(this.getSelectedGenres());
    }


}
