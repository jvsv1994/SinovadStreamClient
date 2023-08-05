import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TvSerie } from 'src/app/tvseries/shared/tvserie.model';
import { User } from 'src/app/users/shared/user.model';

@Component({
  selector: 'app-season-list-modal',
  templateUrl: 'season-list-modal.page.html',
  styleUrls: ['season-list-modal.page.scss'],
})
export class SeasonListModalPage{

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
