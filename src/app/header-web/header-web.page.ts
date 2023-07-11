
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NavbarOption } from '../models/navbarOption';
import { HttpMethodType } from '../Enums';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { Profile } from '../models/profile';

declare var window;
@Component({
  selector: 'app-header-web',
  templateUrl: './header-web.page.html',
  styleUrls: ['./header-web.page.scss']
})
export class HeaderWebPage extends ParentComponent implements OnInit {

  @ViewChild('searchTarget') searchTarget: ElementRef;
  customKeyboardEvent:any;
  searchText:string=undefined;
  @Output() selectOption =new EventEmitter();
  @Output() showSplashScreen =new EventEmitter();
  @Output() logout =new EventEmitter();
  @Output() goHome =new EventEmitter();
  @Output() search =new EventEmitter();
  @Output() toggleMenu =new EventEmitter();
  @Input() listProfiles:Profile[];
  navbarOptions:NavbarOption[]=[
    {
      index:1,
      name:"Inicio",
      method:"ShowInitial",
      iconClass:"fa-solid fa-house"
    },
    {
      index:2,
      name:"Películas",
      method:"ShowMovies",
      iconClass:"fa-solid fa-film"
    },
    {
      index:3,
      name:"Series",
      method:"ShowSeries",
      iconClass:"fa-solid fa-tv"
    },
    {
      index:4,
      name:"Búsqueda",
      method:"ShowSearch",
      iconClass:"fa-solid fa-magnifying-glass"
    }
  ]

  constructor(
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

  ngOnInit(): void {
  }

  public onClickAvatarButton(){

  }

  public onClickOption(option:NavbarOption){
    this.selectOption.emit(option);
  }

  public onClickChangeProfileButton(){
    this.showSplashScreen.emit(true);
  }

  public onSelectProfile(profile:Profile)
  {
    this.sharedData.currentProfile=profile;
    this.goHome.emit(true);
  }

}
