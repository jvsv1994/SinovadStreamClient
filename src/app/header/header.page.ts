
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { NavbarOption } from '../../models/navbarOption';
import { Router } from '@angular/router';
import { Profile } from '../profiles/shared/profile.model';

declare var window;
@Component({
  selector: 'app-header',
  templateUrl: './header.page.html',
  styleUrls: ['./header.page.scss']
})
export class HeaderPage extends ParentComponent implements OnInit {

  @ViewChild('searchTarget') searchTarget: ElementRef;
  customKeyboardEvent:any;
  @Output() goHome =new EventEmitter();
  @Output() toggleSidebar =new EventEmitter();
  @Output() selectOption =new EventEmitter();
  @Output() logout =new EventEmitter();
  @Output() executeSearch =new EventEmitter();
  @Output() toggleMenu =new EventEmitter();
  @Output() showAdminMode =new EventEmitter();
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
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

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
    this.sharedData.currentProfile=profile;
    this.goHome.emit(true);
  }

  public onClickChangeProfileButton(){
    this.sharedData.showSplashScreen=true;
  }

  public onChangeSearchValue(){
    this.executeSearch.emit(this.searchText);
    this.searchText="";
  }

  public onClickToggleSidebarButton(event:any){
    event.preventDefault();
    event.stopPropagation();
    this.toggleSidebar.emit(true);
  }

}
