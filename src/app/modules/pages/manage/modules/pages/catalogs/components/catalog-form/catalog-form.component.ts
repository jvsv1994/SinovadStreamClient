import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../services/catalog.services';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { Catalog } from '../../model/catalog.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/modules/shared/error-matcher/custom-error-state-matcher';
import { SnackBarService } from 'src/app/modules/shared/services/snack-bar.service';
import { SnackBarType } from 'src/app/modules/shared/components/custom-snack-bar/custom-snack-bar.component';

@Component({
  selector: 'app-catalog-form',
  templateUrl: './catalog-form.component.html',
  styleUrls: ['./catalog-form.component.scss']
})
export class CatalogFormComponent implements OnInit{
  catalog:Catalog;
  catalogFormGroup:FormGroup;
  matcher = new MyErrorStateMatcher();
  showLoading:boolean=false;

	constructor(
    private formBuilder: FormBuilder,
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private snackbarService:SnackBarService,
    private catalogService:CatalogService) {

	}

  ngOnInit(): void {
    var catalogId=this.activatedRoute.snapshot.params.catalogId;
    if(catalogId!=null)
    {
        this.catalogService.getCatalog(catalogId).then((response:SinovadApiGenericResponse)=>{
          this.catalog=response.Data;
          this.buildFormGroup();
        },error=>{
            this.router.navigateByUrl("/404");
        });
    }else{
      this.catalog= new Catalog();
      this.buildFormGroup();
    }
  }

  private buildFormGroup(){
    this.catalogFormGroup = this.formBuilder.group({
      name:new FormControl(this.catalog.Name,[Validators.required])
    });
  }

  public saveItem(){
    if(this.catalogFormGroup.valid)
    {
      this.showLoading=true;
      var movie:Catalog=JSON.parse(JSON.stringify(this.catalog));
      movie.Name=this.catalogFormGroup.value.name;
      this.catalogService.saveCatalog(movie).then((response: any) => {
        this.showLoading=false;
        this.snackbarService.showSnackBar("Se guardo el catálogo satisfactoriamente",SnackBarType.Success);
        this.router.navigateByUrl("/manage/catalogs");
      },error=>{
        this.showLoading=false;
        console.error(error);
      });
    }else{
      this.catalogFormGroup.markAllAsTouched();
    }
  }


}
