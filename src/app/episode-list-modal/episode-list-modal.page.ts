import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { DomSanitizer } from '@angular/platform-browser';
import { ParentComponent } from '../parent/parent.component';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Season } from '../../models/season';

@Component({
  selector: 'app-episode-list-modal',
  templateUrl: 'episode-list-modal.page.html',
  styleUrls: ['episode-list-modal.page.scss'],
})
export class EpisodeListModalPage extends ParentComponent implements OnInit{

  @Input() parent:Season;
  @ViewChild('modalTarget') modalTarget: ElementRef;
  @Output() close=new EventEmitter();;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public ref: ChangeDetectorRef,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public activeRoute: ActivatedRoute,
    public sharedData: SharedDataService,
    public http: HttpClient) {
      super(restProvider,events,domSanitizer,sharedData)

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'}).result.then((result) => {
    }, (reason) => {
      this.close.emit(true);
    });
  }


}
