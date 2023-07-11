
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType} from '../Enums';
import { Episode } from '../models/episode';

@Component({
  selector: 'app-episode-form',
  templateUrl: './episode-form.page.html',
  styleUrls: ['./episode-form.page.scss']
})
export class EpisodeFormPage extends ParentComponent implements OnInit {

  @Input() episode:Episode;
  @Output() close=new EventEmitter();
  @Output() closeWithChanges=new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;

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
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'}).result.then((result) => {
        this.saveItem();
      }, (reason) => {
        this.close.emit(true);
      });
    }

    public saveItem(){
      let methodType=this.episode.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      let path=this.episode.Id>0?"/episodes/Update":"/episodes/Create";
      this.restProvider.executeSinovadApiService(methodType,path,this.episode).then((response: any) => {
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

}
