import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TvSerie } from '../../../tvseries/models/tvserie.model';

@Component({
  selector: 'app-season-list-modal',
  templateUrl: 'season-list-modal.component.html',
  styleUrls: ['season-list-modal.component.scss'],
})
export class SeasonListModalComponent{

  @Input() parent:TvSerie;

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
