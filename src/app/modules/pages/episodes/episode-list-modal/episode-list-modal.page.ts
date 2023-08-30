import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Season } from 'src/app/modules/pages/seasons/shared/season.model';

@Component({
  selector: 'app-episode-list-modal',
  templateUrl: 'episode-list-modal.page.html',
  styleUrls: ['episode-list-modal.page.scss'],
})
export class EpisodeListModalPage{

  @Input() parent:Season;

  constructor(
    private activeModal: NgbActiveModal
    ) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){

  }

  public closeModal(){
    this.activeModal.close();
  }


}
