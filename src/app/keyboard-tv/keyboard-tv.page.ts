
import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient } from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';

declare var window;
@Component({
  selector: 'app-keyboard-tv',
  templateUrl: './keyboard-tv.page.html',
  styleUrls: ['./keyboard-tv.page.scss']
})
export class KeyboardTvPage extends ParentComponent implements OnInit {

  @Output() executeSearch =new EventEmitter();
  searchText:string="";
  rowsLetters:any[]=[
    {
      letters:[
       {
        name:"a"
       },
       {
        name:"b"
       },
       {
        name:"c"
       },
       {
        name:"d"
       },
       {
        name:"e"
       },
       {
        name:"f"
       },
       {
        name:"g"
       }
      ]
    },
    {
      letters:[
       {
        name:"h"
       },
       {
        name:"i"
       },
       {
        name:"j"
       },
       {
        name:"k"
       },
       {
        name:"l"
       },
       {
        name:"m"
       },
       {
        name:"n"
       }
      ]
    },
    {
      letters:[
       {
        name:"ñ"
       },
       {
        name:"o"
       },
       {
        name:"p"
       },
       {
        name:"q"
       },
       {
        name:"r"
       },
       {
        name:"s"
       },
       {
        name:"t"
       }
      ]
    },
    {
      letters:[
       {
        name:"u"
       },
       {
        name:"v"
       },
       {
        name:"w"
       },
       {
        name:"x"
       },
       {
        name:"y"
       },
       {
        name:"z"
       }
      ]
    },
    {
      letters:[
       {
        name:"1"
       },
       {
        name:"2"
       },
       {
        name:"3"
       },
       {
        name:"4"
       },
       {
        name:"5"
       },
       {
        name:"6"
       },
       {
        name:"7"
       }
      ]
    },
    {
      letters:[
       {
        name:"8"
       },
       {
        name:"9"
       }
      ]
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

    public ngAfterViewInit(){
    }

    public clearSearchText(){
      this.searchText="";
      this.executeSearch.emit(this.searchText);
    }

    public onClickSpaceBar(){
      this.searchText=this.searchText+" ";
      this.executeSearch.emit(this.searchText);
    }

    public onClickBackSpace(){
      if(this.searchText!="" && this.searchText.length>1)
      {
        this.searchText=this.searchText.substring(0,this.searchText.length-1);
        this.executeSearch.emit(this.searchText);
      }else{
        this.searchText="";
        this.executeSearch.emit(this.searchText);
      }
    }

    public onClickKey(letter:any){
      this.searchText=this.searchText+letter.name;
      this.executeSearch.emit(this.searchText);
    }
    public onChangeInput(event:any){
      this.searchText=event.target.value;
      this.executeSearch.emit(this.searchText);
    }

}
