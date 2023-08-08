
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared-data.service';

import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { Router } from '@angular/router';
import { Profile } from '../../profiles/shared/profile.model';
import { NavbarOption } from '../shared/navbar-option.model';

declare var window;
@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss']
})
export class HeaderPage implements OnInit {

  @ViewChild('searchTarget') searchTarget: ElementRef;
  customKeyboardEvent:any;
  @Output() toggleSidebar =new EventEmitter();
  @Output() selectOption =new EventEmitter();
  @Output() toggleMenu =new EventEmitter();
  searchText:string='';
  isFocusSearch:boolean=false;
  showDropDown:boolean=false;
  showNavbarSearch:boolean=false;
  @Input() showingSidebarAccount:boolean;
  @Input() showingSidebarAdminMode:boolean;

  constructor(
    private router: Router,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedService: SharedService) {


    }

  ngOnInit(): void {

  }

  ngAfterViewInit(){
    this.addClickEvent();
  }

  public onClickSearchButton(){
    this.showNavbarSearch=true;
  }

  public addClickEvent(){
    const target = document.getElementById("userDropDown");
    document.addEventListener('click', (event) => {
      const withinBoundaries = event.composedPath().includes(target)
      if (withinBoundaries) {
        this.showDropDown=true;
      } else {
        this.showDropDown=false;
      }
    })
  }

  public onClickHomeOption(){
    this.router.navigateByUrl("/home");
  }

  public onClickOption(option:NavbarOption){
    this.selectOption.emit(option);
  }

  public onSelectProfile(profile:Profile)
  {
    this.sharedService.currentProfile=profile;
    this.router.navigateByUrl("/home");
  }

  public onClickChangeProfileButton(){
    this.sharedService.showSplashScreen=true;
  }

  public onChangeSearchValue(){
    if(this.searchText!=undefined && this.searchText!='')
    {
      this.router.navigateByUrl("/search?text="+this.searchText);
    }else{
      this.router.navigateByUrl("/home");
    }
    this.searchText="";
  }

  public onClickToggleSidebarButton(event:any){
    event.preventDefault();
    event.stopPropagation();
    this.toggleSidebar.emit(true);
  }

}
