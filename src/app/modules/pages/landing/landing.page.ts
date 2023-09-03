
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss']
})
export class LandingPage implements OnInit {

  _window=window;
  title: string;
  errorMessage: string;
  showLoading:boolean=false;
  @ViewChild('loginFormContainer') loginFormContainer: ElementRef;
  customKeyboardControlsEvent:any;
  additionalUrlData:any;

  constructor(
    private router: Router,
    public activeRoute: ActivatedRoute,
    public sharedDataService: SharedDataService) {


    }

  ngOnInit(): void {
  }

  public showLoginPage(){
    this.router.navigateByUrl('/login');
  }

  public showRegisterPage(){
    this.router.navigateByUrl('/register');
  }

}
