
import { AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogEnum, HttpMethodType} from 'src/app/shared/enums';
import { CatalogDetail } from 'src/models/catalogDetail';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Menu } from '../shared/menu.model';
import { SinovadApiGenericResponse } from 'src/app/response/sinovadApiGenericResponse';
import { SnackBarService } from 'src/app/shared/services/snack-bar.service';
import { MenuService } from '../shared/menu.service';
import { RestProviderService } from 'src/app/shared/services/rest-provider.service';
import { SnackBarType } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/shared/custom-error-state-matcher';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.page.html',
  styleUrls: ['./menu-form.page.scss']
})
export class MenuFormPage implements OnInit,AfterViewInit{

  @Input() menu:Menu;
  listMenus:Menu[];
  listIconTypes:CatalogDetail[];
  menuForm:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private restProvider:RestProviderService,
    private formBuilder: FormBuilder,
    private activeModal: NgbActiveModal,
    private snackbarService:SnackBarService,
    private menuService:MenuService) {

    }

    //Initialize Data

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

    //Build Form Group

    ngAfterViewInit(){
      this.menuForm = this.formBuilder.group({
        title:new FormControl(this.menu.Title),
        path: new FormControl(this.menu.Path),
        iconType:new FormControl(this.menu.IconTypeCatalogDetailId),
        iconClass:new FormControl(this.menu.IconTypeCatalogDetailId),
        sortOrder:new FormControl(this.menu.SortOrder),
        parentId:new FormControl(this.menu.ParentId),
        enabled:new FormControl(this.menu.Enabled)
      });
    }

    public saveItem(){
      if(this.menuForm.valid)
      {
        this.showLoading=true;
        var menu:Menu=JSON.parse(JSON.stringify(this.menu));
        menu.Title=this.menuForm.value.title;
        menu.Path=this.menuForm.value.path;
        menu.IconClass=this.menuForm.value.iconClass;
        menu.SortOrder=this.menuForm.value.sortOrder;
        menu.IconTypeCatalogDetailId=this.menuForm.value.iconType;
        menu.ParentId=this.menuForm.value.parentId;
        menu.Enabled=this.menuForm.value.enabled;
        this.menuService.saveItem(menu).then((response: any) => {
          this.showLoading=false;
          this.snackbarService.showSnackBar("Se guardo el menu satisfactoriamente",SnackBarType.Success);
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
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


    public closeModal(){
      this.activeModal.dismiss();
    }
}
