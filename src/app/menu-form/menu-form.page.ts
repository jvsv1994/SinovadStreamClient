
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';
import { ParentComponent } from '../parent/parent.component';
import { HttpClient} from '@angular/common/http';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogEnum, HttpMethodType} from 'src/app/shared/enums';
import { Menu } from 'src/models/menu';
import { SinovadApiGenericResponse } from '../response/sinovadApiGenericResponse';
import { CatalogDetail } from 'src/models/catalogDetail';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
  menuForm:FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public restProvider: RestProviderService,
    public http: HttpClient,
    public domSanitizer: DomSanitizer,
    public sharedData: SharedDataService) {
      super(restProvider,domSanitizer,sharedData)

    }

    ngOnInit(): void {
      this.menuForm = this.formBuilder.group({
        title:new FormControl(this.menu.Title),
        path: new FormControl(this.menu.Path),
        iconType:new FormControl(this.menu.IconTypeCatalogDetailId),
        iconClass:new FormControl(this.menu.IconTypeCatalogDetailId),
        sortOrder:new FormControl(this.menu.SortOrder),
        parentId:new FormControl(this.menu.ParentId),
        enabled:new FormControl(this.menu.Enabled)
      });
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
      this.modalService.open(this.modalTarget, {container:"#sinovadMainContainer",
      modalDialogClass:'modal-dialog modal-fullscreen-md-down modal-dialog-centered modal-dialog-scrollable',
      scrollable:true,backdrop: 'static'}).result.then((result) => {
        this.saveItem();
      }, (reason) => {
        this.close.emit(true);
      });
    }

    public saveItem(){
      if(this.menuForm.valid)
      {
        var menu:Menu=JSON.parse(JSON.stringify(this.menu));
        menu.Title=this.menuForm.value.title;
        menu.Path=this.menuForm.value.path;
        menu.IconClass=this.menuForm.value.iconClass;
        menu.SortOrder=this.menuForm.value.sortOrder;
        menu.IconTypeCatalogDetailId=this.menuForm.value.iconType;
        menu.ParentId=this.menuForm.value.parentId;
        menu.Enabled=this.menuForm.value.enabled;
        let methodType=this.menu.Id>0?HttpMethodType.PUT:HttpMethodType.POST;
        let path=this.menu.Id>0?"/menus/Update":"/menus/Create";
        this.restProvider.executeSinovadApiService(methodType,path,menu).then((response: any) => {
          this.closeWithChanges.emit(true);
        },error=>{
          console.error(error);
        });
      }else{
        this.menuForm.markAllAsTouched();
      }
    }

    public onChangeParent(event:any){
      this.menu.ParentId=Number(event.target.value);
    }

    public onChangeIconType(event:any){
      this.menu.IconTypeCatalogId=CatalogEnum.IconTypes;
      this.menu.IconTypeCatalogDetailId=Number(event.target.value);
    }
}
