import { AfterViewInit, Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../models/episode.model';

@Component({
  selector: 'app-episode-form',
  templateUrl: './episode-form.component.html',
  styleUrls: ['./episode-form.component.scss']
})
export class EpisodeFormComponent implements AfterViewInit{

  @Input() episode:Episode;
  episodeFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private episodeService:EpisodeService) {

    }

    public ngAfterViewInit(){
      this.episodeFormGroup = this.formBuilder.group({
        title:new FormControl(this.episode.Title, [Validators.required]),
        episodeNumber: new FormControl(this.episode.EpisodeNumber),
        summary:new FormControl(this.episode.Summary)
      });
    }

    public saveItem(){
      if(this.episodeFormGroup.valid)
      {
        this.showLoading=true;
        var episode:Episode=JSON.parse(JSON.stringify(this.episode));
        episode.EpisodeNumber=this.episodeFormGroup.value.episodeNumber;
        episode.Title=this.episodeFormGroup.value.title;
        episode.Summary=this.episodeFormGroup.value.summary;
        this.episodeService.saveItem(episode).then((response) => {
          this.showLoading=false;
          this.episode=undefined;
          this.snackbarService.showSnackBar("Se guardo el episodio satisfactoriamente satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          this.snackbarService.showSnackBar(error,SnackBarType.Error);
        });
      }else{
        this.episodeFormGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
