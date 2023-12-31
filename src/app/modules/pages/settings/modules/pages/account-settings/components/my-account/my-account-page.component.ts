
import { Component, OnInit } from '@angular/core';
import { CatalogDetail } from 'src/app/modules/pages/manage/modules/pages/catalogs/model/catalog-detail.model';
import { CatalogService } from 'src/app/modules/pages/manage/modules/pages/catalogs/services/catalog.services';
import { CatalogEnum } from 'src/app/modules/shared/enums/enums';
import { SinovadApiGenericResponse } from 'src/app/modules/shared/models/response/sinovad-api-generic-response.model';
import { SharedDataService } from 'src/app/services/shared-data.service';

declare var window;
@Component({
  selector: 'app-my-account-page',
  templateUrl: './my-account-page.component.html',
  styleUrls: ['./my-account-page.component.scss','../../styles/account-settings-section.scss']
})
export class MyAccountPageComponent implements OnInit {

  isCollapsedLinkedAccountsSection:boolean=true;
  isCollapsedChangeNamesSection:boolean=true;
  isCollapsedChangeUsernameSection:boolean=true;
  isCollapsedChangePasswordSection:boolean=true;
  allLinkedAccountProviders:CatalogDetail[]=[];
  currentUserLinkedAccountsText:string;
  currentUserLinkedAccountIds:number[]=[];

  constructor(
    private catalogService:CatalogService,
    public sharedDataService: SharedDataService) {
    }

    ngOnInit(): void {
      this.currentUserLinkedAccountIds=this.sharedDataService.linkedAccounts.map(x=>x.LinkedAccountProviderCatalogDetailId);
      this.catalogService.getDetailsByCatalogId(CatalogEnum.LinkedAccountProvider).then((response:SinovadApiGenericResponse)=>{
        this.allLinkedAccountProviders=response.Data;
        this.currentUserLinkedAccountsText=this.allLinkedAccountProviders.filter(x=>this.currentUserLinkedAccountIds.indexOf(x.Id)!=-1).map(x=>x.Name).join(",");
      },error=>{

      });
    }


}
