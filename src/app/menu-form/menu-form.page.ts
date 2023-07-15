
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/services/shared-data.service';
import { EventsService } from 'src/services/events-service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogEnum, HttpMethodType} from '../enums';
import { Menu } from 'src/models/menu';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { CatalogDetail } from 'src/models/catalogDetail';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.page.html',
  styleUrls: ['./menu-form.page.scss']
})
export class MenuFormPage extends ParentComponent implements OnInit {

  @Input() menu:Menu;
  listMenus:Menu[];
  listIconTypes:CatalogDetail[];
  @Output() close=new EventEmitter();
  @Output() closeWithChanges=new EventEmitter();
  @ViewChild('modalTarget') modalTarget: ElementRef;

  constructor(
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public events: EventsService,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,events,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.getAllMenus();
      this.getIconTypes();
    }

    private getAllMenus():void{
      var path="/menus/GetAllAsync";
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        var data=response.Data;
        this.listMenus=data;
      },error=>{
        console.error(error);
      });
    }

    private getIconTypes():void{
      var path="/catalogs/GetDetailsByCatalogAsync/"+CatalogEnum.IconTypes;
      this.restProvider.executeSinovadApiService(HttpMethodType.GET,path).then((response:SinovadApiGenericResponse) => {
        var data=response.Data;
        this.listIconTypes=data;
      },error=>{
        console.error(error);
      });
    }

    ngAfterViewInit(){
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",modalDialogClass:'modal-dialog modal-dialog-centered modal-dialog-scrollable',scrollable:true,ariaLabelledBy: 'exampleModalCenteredScrollableTitle'}).result.then((result) => {
        this.saveItem();
      }, (reason) => {
        this.close.emit(true);
      });
    }

    public saveItem(){
      let methodType=this.menu.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
      let path=this.menu.Id>0?"/menus/Update":"/menus/Create";
      this.restProvider.executeSinovadApiService(methodType,path,this.menu).then((response: any) => {
        this.closeWithChanges.emit(true);
      },error=>{
        console.error(error);
      });
    }

    public onChangeParent(event:any){
      this.menu.ParentId=Number(event.target.value);
    }

    public onChangeIconType(event:any){
      this.menu.IconTypeCatalogId=CatalogEnum.IconTypes;
      this.menu.IconTypeCatalogDetailId=Number(event.target.value);
    }
}
