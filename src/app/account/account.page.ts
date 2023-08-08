
import { Component, OnInit } from '@angular/core';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit {

  isCollapsedChangePasswordSection:boolean=true;
  constructor(
    private router: Router,
    public sharedData: SharedDataService) {
    }

    ngOnInit(): void {
      if(this.sharedData.apiToken==undefined)
      {
        this.router.navigateByUrl('/landing');
      }
    }


}
