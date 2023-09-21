import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogDetail } from '../../model/catalog-detail.model';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { CatalogDetailService } from '../../services/catalog-detail.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';
import { CatalogService } from '../../services/catalog.services';

@Component({
  selector: 'app-catalog-detail-form',
  templateUrl: './catalog-detail-form.component.html',
  styleUrls: ['./catalog-detail-form.component.scss']
})
export class CatalogDetailFormComponent {
  catalogDetail:CatalogDetail;
  catalogDetailFormGroup:FormGroup;
  matcher = new MyErrorStateMatcher();
  showLoading:boolean=false;

	constructor(
    private formBuilder: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbarService:SnackBarService,
    private catalogService:CatalogService,
    private catalogDetailService:CatalogDetailService) {

	}

  ngOnInit(): void {
    var catalogId=this.activatedRoute.snapshot.params.catalogId;
    if(catalogId!=null)
    {
      var catalogDetailId=this.activatedRoute.snapshot.params.catalogDetailId;
      if(catalogDetailId!=null)
      {
          this.catalogDetailService.get(catalogId,catalogDetailId).then((response:SinovadApiGenericResponse)=>{
            this.catalogDetail=response.Data;
            this.buildFormGroup();
          },error=>{
              this.router.navigateByUrl("/404");
          });
      }else{
        this.catalogService.get(catalogId).then((response:SinovadApiGenericResponse)=>{
          this.catalogDetail= new CatalogDetail();
          this.catalogDetail.Catalog=response.Data;
          this.catalogDetail.CatalogId=catalogId;
          this.buildFormGroup();
        },error=>{
            this.router.navigateByUrl("/404");
        });
      }
    }
  }

  private buildFormGroup(){
    this.catalogDetailFormGroup = this.formBuilder.group({
      name:new FormControl(this.catalogDetail.Name,[Validators.required])
    });
  }

  public saveItem(){
    if(this.catalogDetailFormGroup.valid)
    {
      this.showLoading=true;
      var catalogDetail:CatalogDetail=JSON.parse(JSON.stringify(this.catalogDetail));
      catalogDetail.Name=this.catalogDetailFormGroup.value.name;
      this.catalogDetailService.save(catalogDetail).then((response: any) => {
        this.showLoading=false;
        this.snackbarService.showSnackBar("Se guardo el detalle catálogo satisfactoriamente",SnackBarType.Success);
        this.router.navigateByUrl("/manage/catalogs/"+this.catalogDetail.CatalogId+"/details");
      },error=>{
        this.showLoading=false;
        console.error(error);
      });
    }else{
      this.catalogDetailFormGroup.markAllAsTouched();
    }
  }
}
