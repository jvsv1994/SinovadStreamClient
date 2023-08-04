
import { AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogDetail } from 'src/models/catalogDetail';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Movie } from '../shared/movie.model';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MovieService } from '../shared/movie.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/shared/custom-error-state-matcher';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.page.html',
  styleUrls: ['./movie-form.page.scss']
})
export class MovieFormPage implements OnInit,AfterViewInit{

  @Input() movie:Movie;
  listMovies:Movie[];
  listIconTypes:CatalogDetail[];
  movieFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private restProvider:RestProviderService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private movieService:MovieService) {

    }

    //Initialize Data

    ngOnInit(): void {

    }

    //Build Form Group

    ngAfterViewInit(){
      this.movieFormGroup = this.formBuilder.group({
        title:new FormControl(this.movie.Title,[Validators.required]),
        releaseDate:new FormControl(this.formatDate(this.movie.ReleaseDate)),
        directors:new FormControl(this.movie.Directors),
        actors:new FormControl(this.movie.Actors),
        overview:new FormControl(this.movie.Overview),
        posterPath:new FormControl(this.movie.PosterPath)
      });
    }

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

    public showListGenresPopUp(){

    }

}
