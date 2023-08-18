
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss']
})
export class AccountPage implements OnInit {

  isCollapsedChangePasswordSection:boolean=true;
  constructor(
    public sharedService: SharedService) {
    }

    ngOnInit(): void {
    }


}
