
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
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
  }

  public goInitialPage(){
    var pagePath=this.sharedService.apiToken!=undefined?"/home":"/landing";
    this.router.navigateByUrl(pagePath).then((response) => {

    },error=>{
      console.error(error);
    });
  }


}
