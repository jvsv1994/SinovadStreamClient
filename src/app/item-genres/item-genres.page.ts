
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { TvProgram } from '../../models/tvProgram';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Genre } from '../../models/genre';
import { TvProgramGenre } from '../../models/tvProgramGenre';

@Component({
  selector: 'app-item-genres',
  templateUrl: './item-genres.page.html',
  styleUrls: ['./item-genres.page.scss']
})
export class ItemGenresPage extends ParentComponent implements OnInit {

  @Input() tvProgram:TvProgram;
  @Input() listAllGenresPopUp:Genre[];
  @Output() close=new EventEmitter();;
  @Output() closeWithChanges=new EventEmitter();

  @ViewChild('modalTarget') modalTarget: ElementRef;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngAfterViewInit(){
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,backdrop: 'static'}).result.then((result) => {
        this.selectItemGenres();
      }, (reason) => {
        this.close.emit(true);
      });
    }

    public onInitializeGenrePopUp(genre:Genre,checkbox:any){
      genre.Checkbox=checkbox;
      if(this.tvProgram.ListItemGenres)
      {
        let index=this.tvProgram.ListItemGenres.findIndex(item=>item.GenreId==genre.Id);
        if(index!=-1)
        {
          genre.Checkbox.checked=true;
        }
      }
    }

    public selectItemGenres(){
      let listAllGenresPopUpSelected=this.listAllGenresPopUp.filter(item=>item.Checkbox.checked);
      let ListItemGenres:TvProgramGenre[]=[];
      listAllGenresPopUpSelected.forEach(element => {
        ListItemGenres.push({GenreName:element.Name,GenreId:element.Id});
      });
      this.closeWithChanges.emit(ListItemGenres);
    }

}
