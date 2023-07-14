
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { SinovadApiPaginationResponse } from '../response/sinovadApiPaginationResponse';
import { PaginationItem } from '../../models/paginationPage';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.page.html',
  styleUrls: ['./pagination.page.scss']
})
export class PaginationPage extends ParentComponent implements OnInit {


  listPages:PaginationItem[];
  @Input() responsePagination:SinovadApiPaginationResponse;
  @Output() selectPage=new EventEmitter();

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.updatePagination();
    }

    public updatePagination(){
      var listPages:PaginationItem[]= [];
      var currentPage=this.responsePagination.PageNumber;
      var totalPages=this.responsePagination.TotalPages;
      if(totalPages<=5)
      {
        for(var i=1;i<=totalPages;i++)
        {
          var pi= new PaginationItem();
          pi.Text=i.toString();
          listPages.push(pi);
        }
      }else{
        if(currentPage>2)
        {
          listPages.push({Text:"1",IsButton:true});
          if(currentPage>3)
          {
            listPages.push({Text:"...",IsButton:false});
          }
        }
        var minPage=currentPage>1?currentPage-1:currentPage;
        var maxPage=minPage+5>totalPages?totalPages:minPage+5;
        for(var i=minPage;i<=maxPage;i++)
        {
          var pi= new PaginationItem();
          pi.Text=i.toString();
          listPages.push(pi);
        }
        if(maxPage<totalPages)
        {
          if(maxPage+1<totalPages)
          {
            listPages.push({Text:"...",IsButton:false});
          }
          listPages.push({Text:this.responsePagination.TotalPages.toString(),IsButton:true});
        }
      }
      this.listPages=listPages;
    }

    ngOnChanges(){
      this.updatePagination();
    }

    ngAfterViewInit(){

    }

    public onSelectPreviousPage(){
      var page=this.responsePagination.PageNumber-1;
      this.selectPage.emit(page.toString());
    }

    public onSelectPage(page:string){
      this.selectPage.emit(page);
    }

    public onSelectNextPage(){
      var page=this.responsePagination.PageNumber+1;
      this.selectPage.emit(page.toString());
    }

}
