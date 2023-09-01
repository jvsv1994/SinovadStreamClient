
import { Component, Input} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { Genre } from '../../models/genre.model';

@Component({
  selector: 'app-genres-selection-modal',
  templateUrl: './genres-selection-modal.component.html',
  styleUrls: ['./genres-selection-modal.component.scss']
})
export class GenresSelectionModalComponent {

  @Input() listAllGenres:Genre[];
  @Input() selection:SelectionModel<Genre>;

  constructor(private activeModal: NgbActiveModal) {

    }

    public closeModal(){
      this.activeModal.dismiss();
    }

    public onSaveSelection(){
      this.activeModal.close(this.selection.selected);
    }

    public onChangeCheckValue(event:any,item:Genre)
    {
      let addItems:boolean=event.target.checked;
      if(addItems)
      {
        this.selection.select(item);
      }else{
        this.selection.deselect(item);
      }
    }

}
