
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';
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
    public sharedService: SharedService) {
    }

    ngOnInit(): void {
      if(this.sharedService.apiToken==undefined)
      {
        this.router.navigateByUrl('/landing');
      }
    }


}
