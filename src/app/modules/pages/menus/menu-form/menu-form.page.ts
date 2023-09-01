
import { AfterViewInit, Component, Input, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogEnum, HttpMethodType} from 'src/app/modules/shared/enums/enums';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Menu } from '../shared/menu.model';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { MenuService } from '../shared/menu.service';
import { RestProviderService } from 'src/app/modules/shared/services/rest-provider.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { SharedService } from 'src/app/modules/shared/services/shared-data.service';
import { CatalogDetail } from 'src/app/modules/pages/catalogs/shared/catalog-detail.model';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.page.html',
  styleUrls: ['./menu-form.page.scss']
})
export class MenuFormPage implements OnInit,AfterViewInit{

  @Input() menu:Menu;
  listMenusSelectable:Menu[];
  listIconTypes:CatalogDetail[];
  menuFormGroup:FormGroup;
  showLoading:boolean=false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private sharedService:SharedService,
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
      this.menuService.getAllMenus().then((response:SinovadApiGenericResponse) => {
        var data=response.Data;
        this.listMenusSelectable=data.filter(ele=>ele.Id!=this.menu.Id);
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
      this.menuFormGroup = this.formBuilder.group({
        title:new FormControl(this.menu.Title, [Validators.required]),
        path: new FormControl(this.menu.Path),
        iconType:new FormControl(this.menu.IconTypeCatalogDetailId),
        iconClass:new FormControl(this.menu.IconClass),
        sortOrder:new FormControl(this.menu.SortOrder),
        parentId:new FormControl(this.menu.ParentId),
        enabled:new FormControl(this.menu.Enabled)
      });
    }

    public saveItem(){
      if(this.menuFormGroup.valid)
      {
        this.showLoading=true;
        var menu:Menu=JSON.parse(JSON.stringify(this.menu));
        menu.Title=this.menuFormGroup.value.title;
        menu.Path=this.menuFormGroup.value.path;
        menu.IconClass=this.menuFormGroup.value.iconClass;
        menu.SortOrder=this.menuFormGroup.value.sortOrder;
        if(this.menuFormGroup.value.iconType!=undefined)
        {
          menu.IconTypeCatalogId=CatalogEnum.IconTypes;
          menu.IconTypeCatalogDetailId=this.menuFormGroup.value.iconType;
        }else{
          menu.IconTypeCatalogId=undefined;
          menu.IconTypeCatalogDetailId=undefined;
        }
        menu.ParentId=this.menuFormGroup.value.parentId;
        menu.Enabled=this.menuFormGroup.value.enabled;
        this.menuService.saveItem(menu).then((response: any) => {
          this.showLoading=false;
          this.snackbarService.showSnackBar("Se guardo el menu satisfactoriamente",SnackBarType.Success);
          this.menuService.getManageMenu();
          this.activeModal.close();
        },error=>{
          this.showLoading=false;
          console.error(error);
        });
      }else{
        this.menuFormGroup.markAllAsTouched();
      }
    }

    public closeModal(){
      this.activeModal.dismiss();
    }
}