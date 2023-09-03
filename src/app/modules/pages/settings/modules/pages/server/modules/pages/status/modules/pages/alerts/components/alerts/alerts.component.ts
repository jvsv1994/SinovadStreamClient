import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Alert } from '../../models/alert.model';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { AlertsService } from '../../services/alerts.service';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { AlertType } from 'src/app/modules/shared/enums/enums';
import { MatTableDataSource } from '@angular/material/table';
import { SinovadApiPaginationResponse } from 'src/app/modules/shared/models/response/sinovad-api-pagination-response.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { SignalIRHubService } from 'src/app/modules/shared/services/signal-ir-hub.service';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent extends CustomListGeneric<Alert> {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  mediaServer:MediaServer;
  loadingConnection:boolean=true;
  subscriptionEnableMediaServer:Subscription;
  subscriptionDisableMediaServer:Subscription;

  constructor(
    private ref:ChangeDetectorRef,
    public sharedDataService: SharedDataService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    private signalIrService:SignalIRHubService,
    private alertsService:AlertsService,
    public matPaginatorIntl: MatPaginatorIntl)
    {
      super(matPaginatorIntl);
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscriptionEnableMediaServer=this.signalIrService.isEnablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && !this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=true;
          this.loadingConnection=false;
          this.ref.detectChanges();
          this.initializePaginator();
          this.getAllItems();
        }
      });
      this.subscriptionDisableMediaServer=this.signalIrService.isDisablingMediaServer().subscribe((mediaServerGuid:string) => {
        if(this.mediaServer && this.mediaServer.Guid==mediaServerGuid && this.mediaServer.isSecureConnection)
        {
          this.mediaServer.isSecureConnection=false;
        }
      });
  }

  ngOnInit(): void {
    var mediaServerGuid=this.activeRoute.snapshot.params.serverGuid;
    var mediaServer=this.sharedDataService.mediaServers.find(x=>x.Guid==mediaServerGuid)
    if(mediaServer)
    {
      this.mediaServer=JSON.parse(JSON.stringify(mediaServer));
      if(mediaServer.isSecureConnection)
      {
        this.loadingConnection=false;
        this.getAllItems();
      }else{
        setTimeout(() => {
          this.loadingConnection=false;
        }, 3000);
      }
    }else{
      this.router.navigateByUrl('/404')
    }
  }

  ngAfterViewInit(){
    if(this.mediaServer && this.mediaServer.isSecureConnection)
    {
      this.initializePaginator();
    }
  }

  initializePaginator() {
    this.paginator.page.subscribe((event:PageEvent) => {
        this.updatePageData(event);
        this.getAllItems();
      }
    );
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(){
    this.subscriptionEnableMediaServer.unsubscribe();
    this.subscriptionDisableMediaServer.unsubscribe();
  }

  public getAllItems(){
    this.showLoading=true;
    this.alertsService.getAlertsByMediaServer(this.mediaServer.Url,this.currentPage,this.itemsPerPage).then((response:SinovadApiPaginationResponse) => {
      this.showLoading=false;
      var data=response.Data;
      this.totalCount=response.TotalCount;
      this.listItems=data;
      this.dataSource = new MatTableDataSource(this.listItems);
      this.paginator.length=this.totalCount;
      this.paginator.pageIndex=this.currentPage-1;
      this.paginator.pageSize=this.itemsPerPage;
    },error=>{
      this.showLoading=false;
    });
  }

  public getDisplayedColumns(){
    return ['AlertType','Created', 'Description'];
  }

  public getIconByAlertType(alertType:AlertType){
    if(alertType==AlertType.Bullhorn)
    {
      return "fa-solid fa-bullhorn";
    }
    if(alertType==AlertType.Tags)
    {
      return "fa-solid fa-tags";
    }
    if(alertType==AlertType.Ok)
    {
      return "fa-solid fa-check";
    }
    if(alertType==AlertType.Plus)
    {
      return "fa-solid fa-plus";
    }
    if(alertType==AlertType.Bin)
    {
      return "fa-solid fa-trash";
    }
    return "";
  }

}
