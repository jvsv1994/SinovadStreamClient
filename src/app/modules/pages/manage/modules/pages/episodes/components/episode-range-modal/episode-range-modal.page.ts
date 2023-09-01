
import { Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { EpisodeService } from '../../services/episode.service';
import { Season } from '../../../seasons/models/season.model';
import { Episode } from '../../models/episode.model';

@Component({
  selector: 'app-episode-range-modal',
  templateUrl: './episode-range-modal.page.html',
  styleUrls: ['./episode-range-modal.page.scss']
})
export class EpisodeRangeModalPage{

  formGroup:FormGroup;
  @Input() parent:Season;
  matcher = new MyErrorStateMatcher();
  showLoading:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private episodeService:EpisodeService,
    private activeModal: NgbActiveModal) {}

    public ngAfterViewInit(){
      this.formGroup = this.formBuilder.group({
        initialEpisodeNumber:new FormControl('', [Validators.required]),
        lastEpisodeNumber:new FormControl('', [Validators.required])
      });
    }

    public save(){
      if(this.formGroup.valid)
      {
        this.showLoading=true;
        let listEpisodes:Episode[]=[];
        for(let i=Number(this.formGroup.value.initialEpisodeNumber);i <= Number(this.formGroup.value.lastEpisodeNumber);i++)
        {
          var episode= new Episode();
          episode.EpisodeNumber=i;
          episode.SeasonId=this.parent.Id;
          episode.Title="Episodio "+i;
          listEpisodes.push(episode);
        }
        this.episodeService.createList(listEpisodes).then((response) => {
          this.showLoading=false;
          this.activeModal.close(true);
        },error=>{
          this.showLoading=false;
          console.error(error);
        });
      }else{
        this.formGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }

}
