import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../users/models/user.model';

@Component({
  selector: 'app-media-server-list-modal',
  templateUrl: 'media-server-list-modal.component.html',
  styleUrls: ['media-server-list-modal.component.scss'],
})
export class MediaServerListModalComponent{

  @Input() parent:User;

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
