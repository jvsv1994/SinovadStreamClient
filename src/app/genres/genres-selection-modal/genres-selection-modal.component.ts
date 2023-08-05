
import { Component, Input} from '@angular/core';
import { Genre } from '../shared/genre.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-genres-selection-modal',
  templateUrl: './genres-selection-modal.component.html',
  styleUrls: ['./genres-selection-modal.component.scss']
})
export class GenresSelectionModalComponent {

  @Input() listSelectionGenres:Genre[];
  @Input() listAllGenres:Genre[];

  constructor(private activeModal: NgbActiveModal) {

    }

    ngAfterViewInit(){

    }

    public closeModal(){
      this.activeModal.dismiss();
    }

    public onSaveSelection(){
      this.activeModal.close(this.listSelectionGenres);
    }

}
