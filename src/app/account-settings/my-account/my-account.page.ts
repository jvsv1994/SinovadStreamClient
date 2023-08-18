
import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss','../shared/styles/account-settings-section.scss']
})
export class MyAccountPage implements OnInit {

  isCollapsedChangePasswordSection:boolean=true;
  constructor(
    public sharedService: SharedService) {
    }

    ngOnInit(): void {
    }


}
