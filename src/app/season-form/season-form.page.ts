
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType} from '../Enums';
import { Season } from '../models/season';

@Component({
  selector: 'app-season-form',
  templateUrl: './season-form.page.html',
  styleUrls: ['./season-form.page.scss']
})
export class SeasonFormPage extends ParentComponent implements OnInit {

  @Input() season:Season;
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
      let methodType=this.season.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      let path=this.season.Id>0?"/seasons/Update":"/seasons/Create";
      this.restProvider.executeSinovadApiService(methodType,path,this.season).then((response: any) => {
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

}
