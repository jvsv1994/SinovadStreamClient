
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpMethodType} from '../enums';
import { Season } from '../../models/season';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  seasonForm:FormGroup;

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
      this.seasonForm = this.formBuilder.group({
        seasonNumber: new FormControl(this.season.SeasonNumber),
        name:new FormControl(this.season.Name),
        summary:new FormControl(this.season.Summary)
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
      if(this.seasonForm.valid)
      {
        var season:Season=JSON.parse(JSON.stringify(this.season));
        season.SeasonNumber=this.seasonForm.value.seasonNumber;
        season.Name=this.seasonForm.value.name;
        season.Summary=this.seasonForm.value.summary;
        let methodType=this.season.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
        let path=this.season.Id>0?"/seasons/Update":"/seasons/Create";
        this.restProvider.executeSinovadApiService(methodType,path,season).then((response: any) => {
          this.closeWithChanges.emit(true);
        },error=>{
          console.error(error);
        });
      }else{
        this.seasonForm.markAllAsTouched();
      }
    }

}
