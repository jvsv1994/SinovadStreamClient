import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Season } from '../../../seasons/models/season.model';

@Component({
  selector: 'app-episode-list-modal',
  templateUrl: 'episode-list-modal.component.html',
  styleUrls: ['episode-list-modal.component.scss'],
})
export class EpisodeListModalComponent{

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
