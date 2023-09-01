
import { AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { GenreService } from '../../services/genre.service';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-genre-form',
  templateUrl: './genre-form.page.html',
  styleUrls: ['./genre-form.page.scss']
})
export class GenreFormPage implements OnInit,AfterViewInit{

  @Input() genre:Genre;
  genreFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private genreService:GenreService) {

    }

    //Initialize Data

    ngOnInit(): void {

    }

    //Build Form Group

    ngAfterViewInit(){
      this.genreFormGroup = this.formBuilder.group({
        name:new FormControl(this.genre.Name,[Validators.required])
      });
    }

    public saveItem(){
      if(this.genreFormGroup.valid)
      {
        this.showLoading=true;
        var genre:Genre=JSON.parse(JSON.stringify(this.genre));
        genre.Name=this.genreFormGroup.value.name;
        this.genreService.saveItem(genre).then((response: any) => {
          this.showLoading=false;
          this.snackbarService.showSnackBar("Se guardo el genre satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          console.error(error);
        });
      }else{
        this.genreFormGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
