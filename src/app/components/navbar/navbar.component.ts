
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Router } from '@angular/router';
import { NavbarOption } from 'src/app/models/navbar-option.model';
import { CommonService } from 'src/app/services/common.service';
import { Profile } from 'src/app/modules/pages/profiles/models/profile.model';

declare var window;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

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
    public commonService:CommonService,
    public sharedDataService: SharedDataService) {


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
    this.sharedDataService.currentProfile=profile;
    this.router.navigateByUrl("/home");
  }

  public onClickChangeProfileButton(){
    this.sharedDataService.showSplashScreen=true;
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
