
import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogDetail } from 'src/models/catalogDetail';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../shared/movie.model';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MovieService } from '../shared/movie.service';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/shared/custom-error-state-matcher';
import { GenresSelectionModalComponent } from 'src/app/genres/genres-selection-modal/genres-selection-modal.component';
import { GenreService } from 'src/app/genres/shared/genre.service';
import { Genre } from 'src/app/genres/shared/genre.model';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.page.html',
  styleUrls: ['./movie-form.page.scss']
})
export class MovieFormPage implements OnInit{

  @Input() movie:Movie;
  listMovies:Movie[];
  listIconTypes:CatalogDetail[];
  movieFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();
  listGenres:Genre[];

  constructor(
    private modalService: NgbModal,
    private genreService:GenreService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private movieService:MovieService) {

    }

    //Initialize Data

    ngOnInit(): void {
      this.buildFormGroup();
      this.genreService.getAllGenres().then((response:SinovadApiGenericResponse)=>{
        this.listGenres=response.Data;
      })
      this.getMovie();
    }

    //Build Form Group

    private buildFormGroup(){
      this.movieFormGroup = this.formBuilder.group({
        title:new FormControl(this.movie.Title,[Validators.required]),
        releaseDate:new FormControl(this.formatDate(this.movie.ReleaseDate)),
        directors:new FormControl(this.movie.Directors),
        actors:new FormControl(this.movie.Actors),
        overview:new FormControl(this.movie.Overview),
        posterPath:new FormControl(this.movie.PosterPath),
        selectedGenres:new FormControl("")
      });
    }


    //Get Movie

    private getMovie(){
      this.movieService.getMovie(this.movie.Id).then((response:SinovadApiGenericResponse)=>{
        this.movie=response.Data;
        this.movieFormGroup.controls['selectedGenres'].patchValue(this.getSelectedGenres());
      })
    }


    //Save

    public saveItem(){
      if(this.movieFormGroup.valid)
      {
        this.showLoading=true;
        var movie:Movie=JSON.parse(JSON.stringify(this.movie));
        movie.Title=this.movieFormGroup.value.title;
        movie.ReleaseDate=this.movieFormGroup.value.releaseDate;
        movie.Directors=this.movieFormGroup.value.directors;
        movie.Actors=this.movieFormGroup.value.actors;
        movie.Overview=this.movieFormGroup.value.overview;
        this.movieService.saveItem(movie).then((response: any) => {
          this.showLoading=false;
          this.snackbarService.showSnackBar("Se guardo el movie satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          console.error(error);
        });
      }else{
        this.movieFormGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

    //auxiliary methods

    public formatDate(date:any) {
      const d = new Date(date);
      let month = '' + (d.getMonth() + 1);
      let day = '' + d.getDate();
      const year = d.getFullYear();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [year, month, day].join('-');
    }

    public getSelectedGenres():string{
      if(this.movie.ListItemGenres && this.movie.ListItemGenres.length>0)
      {
        var listGenres = this.movie.ListItemGenres.map(a => a.GenreName);
        return listGenres.join(", ");
      }
      return "";
    }

    public showGenresSelectionModal(){
      var ctx=this;
      var ref=this.modalService.open(GenresSelectionModalComponent, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'});
      ref.componentInstance.listAllGenres=this.listGenres;
      ref.closed.subscribe((selectionGenres:Genre[])=>{

      })
    }


}
