import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/modules/users/shared/user.model';

@Component({
  selector: 'app-media-server-list-modal',
  templateUrl: 'media-server-list-modal.page.html',
  styleUrls: ['media-server-list-modal.page.scss'],
})
export class MediaServerListModalPage{

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
