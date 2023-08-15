
import { Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../shared/movie.model';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MovieService } from '../shared/movie.service';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/shared/custom-error-state-matcher';
import { GenresSelectionModalComponent } from 'src/app/genres/genres-selection-modal/genres-selection-modal.component';
import { GenreService } from 'src/app/genres/shared/genre.service';
import { Genre } from 'src/app/genres/shared/genre.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MovieGenre } from '../shared/movie-genre.model';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { SinovadApiGenericResponse } from 'src/app/shared/models/response/sinovad-api-generic-response.model';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.page.html',
  styleUrls: ['./movie-form.page.scss']
})
export class MovieFormPage implements OnInit{

  @Input() movie:Movie;
  listMovies:Movie[];
  movieFormGroup:FormGroup;
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
    private movieService:MovieService) {

    }

    //Initialize Data

    ngOnInit(): void {
      this.buildFormGroup();
      this.genreService.getAllGenres().then((response:SinovadApiGenericResponse)=>{
        this.listGenres=response.Data;
      })
      if(this.movie.Id>0)
      {
        this.getMovie();
      }else{
        this.movie.ListItemGenres=[];
      }
    }

    //Build Form Group

    private buildFormGroup(){
      this.movieFormGroup = this.formBuilder.group({
        title:new FormControl(this.movie.Title,[Validators.required]),
        releaseDate:new FormControl(this.sharedService.formatDate(this.movie.ReleaseDate)),
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

    //Close Modal

    public closeModal(){
      this.activeModal.dismiss();
    }

    //Movie Genres Section

    private getSelectedGenres():string{
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
      ref.componentInstance.selection= new SelectionModel<Genre>(true, this.getMovieGenres());
      ref.closed.subscribe((selectedGenres:Genre[])=>{
        ctx.setMovieGenres(selectedGenres);
      })
    }

    private getMovieGenres():Genre[]{
      var listGenreIds = this.movie.ListItemGenres.map(a => a.GenreId);
      return this.listGenres.filter(g=>listGenreIds.indexOf(g.Id)!=-1);
    }

    private setMovieGenres(genres:Genre[]):void{
      var movieGenres:MovieGenre[]=[];
      genres.forEach(genre => {
        movieGenres.push({MovieId:this.movie.Id,GenreId:genre.Id,GenreName:genre.Name});
      });
      this.movie.ListItemGenres=movieGenres;
      this.movieFormGroup.controls['selectedGenres'].patchValue(this.getSelectedGenres());
    }


}
