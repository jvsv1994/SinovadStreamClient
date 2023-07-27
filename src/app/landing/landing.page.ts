
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var window;
@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss']
})
export class LandingPage extends ParentComponent implements OnInit {

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
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

  ngOnInit(): void {
    if(localStorage.getItem('apiToken'))
    {
      this.router.navigateByUrl('/home');
    }
  }

  public showLoginPage(){
    this.router.navigateByUrl('/login');
  }

  public showRegisterPage(){
    this.router.navigateByUrl('/register');
  }

}
