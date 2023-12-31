
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-search-view',
  templateUrl: './search-view.component.html',
  styleUrls: ['./search-view.component.scss']
})
export class SearchViewComponent implements OnInit {

  searchText:string="";

  constructor(
    private router: Router,
    private route:ActivatedRoute,
    public sharedDataService: SharedDataService) {
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
    }

    public ngOnInit(): void {
      let searchText = this.route.snapshot.queryParams['text'];
      if(searchText!=undefined && searchText!='')
      {
        this.searchText=searchText;
      }else{
        this.router.navigate(['home'],{ skipLocationChange: false});
      }
    }



}
