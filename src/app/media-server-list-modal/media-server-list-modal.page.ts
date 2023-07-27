import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from 'src/services/shared-data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ParentComponent } from '../parent/parent.component';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/models/user';

@Component({
  selector: 'app-media-server-list-modal',
  templateUrl: 'media-server-list-modal.page.html',
  styleUrls: ['media-server-list-modal.page.scss'],
})
export class MediaServerListModalPage extends ParentComponent implements OnInit{

  @Input() parent:User;
  @ViewChild('modalTarget') modalTarget: ElementRef;
  @Output() close=new EventEmitter();;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public ref: ChangeDetectorRef,
    public domSanitizer: DomSanitizer,
    public activeRoute: ActivatedRoute,
    public sharedData: SharedDataService,
    public http: HttpClient) {
      super(restProvider,domSanitizer,sharedData)

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
    this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",
    modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-xl modal-dialog-centered modal-dialog-scrollable  modal-list',
    scrollable:true,backdrop: 'static'}).result.then((result) => {
    }, (reason) => {
      this.close.emit(true);
    });
  }


}
