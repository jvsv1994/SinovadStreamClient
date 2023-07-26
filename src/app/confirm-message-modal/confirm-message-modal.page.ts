
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-message-modal',
  templateUrl: './confirm-message-modal.page.html',
  styleUrls: ['./confirm-message-modal.page.scss']
})
export class ConfirmMessageModalPage extends ParentComponent implements OnInit {

  @Input() message:string;
  @Output() close=new EventEmitter();
  @Output() confirm=new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;
  initialEpisodeNumber:number;
  lastEpisodeNumber:number;

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
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'}).result.then((result) => {
        this.confirm.emit(true);
      }, (reason) => {
        this.close.emit(true);
      });
    }



}
