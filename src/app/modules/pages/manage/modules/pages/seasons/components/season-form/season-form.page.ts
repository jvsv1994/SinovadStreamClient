



import { AfterViewInit, Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { Season } from '../../models/season.model';
import { SeasonService } from '../../services/season.service';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.page.html',
  styleUrls: ['./season-form.page.scss']
})
export class SeasonFormPage implements AfterViewInit{

  @Input() season:Season;
  seasonFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private seasonService:SeasonService) {

    }

    public ngAfterViewInit(){
      this.seasonFormGroup = this.formBuilder.group({
        name:new FormControl(this.season.Name, [Validators.required]),
        seasonNumber: new FormControl(this.season.SeasonNumber),
        summary:new FormControl(this.season.Summary)
      });
    }

    public saveItem(){
      if(this.seasonFormGroup.valid)
      {
        this.showLoading=true;
        var season:Season=JSON.parse(JSON.stringify(this.season));
        season.SeasonNumber=this.seasonFormGroup.value.seasonNumber;
        season.Name=this.seasonFormGroup.value.name;
        season.Summary=this.seasonFormGroup.value.summary;
        this.seasonService.saveItem(season).then((response) => {
          this.showLoading=false;
          this.season=undefined;
          this.snackbarService.showSnackBar("Se guardo la temporada satisfactoriamente satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          this.snackbarService.showSnackBar(error,SnackBarType.Error);
        });
      }else{
        this.seasonFormGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
