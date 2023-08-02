
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType} from 'src/app/shared/enums';
import { Season } from '../../models/season';
import { Episode } from '../../models/episode';

@Component({
  selector: 'app-episode-range-modal',
  templateUrl: './episode-range-modal.page.html',
  styleUrls: ['./episode-range-modal.page.scss']
})
export class EpisodeRangeModalPage extends ParentComponent implements OnInit {

  @Input() parent:Season;
  @Output() close=new EventEmitter();
  @Output() closeWithChanges=new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;
  initialEpisodeNumber:number;
  lastEpisodeNumber:number;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {
    }

    ngAfterViewInit(){
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'}).result.then((result) => {
        this.save();
      }, (reason) => {
        this.close.emit(true);
      });
    }

    public save(){
      let listEpisodes:Episode[]=[];
      for(let i=Number(this.initialEpisodeNumber);i <= Number(this.lastEpisodeNumber);i++)
      {
        var episode= new Episode();
        episode.EpisodeNumber=i;
        episode.SeasonId=this.parent.Id;
        episode.Title="Episodio "+i;
        listEpisodes.push(episode);
      }
      this.restProvider.executeSinovadApiService(HttpMethodType.POST,'/episodes/CreateList',listEpisodes).then((response) => {
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

}
