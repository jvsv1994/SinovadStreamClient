
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType} from 'src/app/shared/enums';
import { Episode } from '../../models/episode';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  episodeForm:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.episodeForm = this.formBuilder.group({
        title:new FormControl(this.episode.Title),
        episodeNumber: new FormControl(this.episode.EpisodeNumber),
        summary:new FormControl(this.episode.Summary)
      });
    }

    ngAfterViewInit(){
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',
      scrollable:true,backdrop: 'static'}).result.then((result) => {
        this.saveItem();
      }, (reason) => {
        this.close.emit(true);
      });
    }

    public saveItem(){
      if(this.episodeForm.valid)
      {
        var episode:Episode=JSON.parse(JSON.stringify(this.episode));
        episode.Title=this.episodeForm.value.title;
        episode.EpisodeNumber=this.episodeForm.value.episodeNumber;
        episode.Summary=this.episodeForm.value.summary;
        let methodType=this.episode.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
        let path=this.episode.Id>0?"/episodes/Update":"/episodes/Create";
        this.restProvider.executeSinovadApiService(methodType,path,episode).then((response: any) => {
          this.closeWithChanges.emit(true);
        },error=>{
          console.error(error);
        });
      }else{
        this.episodeForm.markAllAsTouched();
      }
    }

}
