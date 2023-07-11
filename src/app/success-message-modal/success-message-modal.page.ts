
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-message-modal',
  templateUrl: './success-message-modal.page.html',
  styleUrls: ['./success-message-modal.page.scss']
})
export class SuccessMessageModalPage extends ParentComponent implements OnInit {

  @Output() closeModal=new EventEmitter();
  @ViewChild('ignismyModal') ignismyModal: ElementRef;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(){
      this.modalService.open(this.ignismyModal,{container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeModal.emit(true);
      }, (reason) => {
        this.closeModal.emit(true);
      });
    }

}
