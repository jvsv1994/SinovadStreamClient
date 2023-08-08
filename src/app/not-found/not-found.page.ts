
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.page.html',
  styleUrls: ['./not-found.page.scss']
})
export class NotFoundPage implements OnInit {

  constructor(
    private router: Router,
    public sharedService: SharedService) {


    }

  ngOnInit(): void {
    this.sharedService.pageNotFoundShowing=true;
  }

  public goInitialPage(){
    var pagePath=this.sharedService.apiToken!=undefined?"/home":"/landing";
    this.router.navigateByUrl(pagePath).then((response) => {
      this.sharedService.pageNotFoundShowing=false;
    },error=>{
      console.error(error);
    });
  }


}
