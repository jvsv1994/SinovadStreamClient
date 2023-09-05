import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomListGeneric } from 'src/app/modules/shared/generics/custom-list.generic';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { Log } from '../../models/log.model';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription, of } from 'rxjs';
import { SignalIRHubService } from 'src/app/services/signal-ir-hub.service';

@Component({
  selector: 'app-log-page',
  templateUrl: './log-page.component.html',
  styleUrls: ['./log-page.component.scss']
})
export class LogPageComponent extends CustomListGeneric<Log>{

  @ViewChild(MatPaginator) paginator: MatPaginator;
  subscription:Subscription= new Subscription();

  constructor(
    public signalIRHubService: SignalIRHubService,
    public sharedDataService: SharedDataService,
    private router: Router,
    public activeRoute: ActivatedRoute,
    public matPaginatorIntl: MatPaginatorIntl)
    {
      super(matPaginatorIntl);
      this.router.routeReuseStrategy.shouldReuseRoute = function () {
        return false;
      };
      this.subscription.add(this.signalIRHubService.isUpdatingWebLogs().subscribe(x=>{
        this.getAllItems();
      }));
    }

    ngOnInit(){
      this.getAllItems();
    }

    ngAfterViewInit(){
      this.initializePaginator();
      this.getAllItems();
    }

    ngOnDestroy(){
      this.subscription.unsubscribe();
    }

    public getAllItems(){
      this.listItems=this.sharedDataService.webLogs.sort((a: Log, b: Log) => {
        if (new Date(a.Created).getTime()>new Date(b.Created).getTime())    return -1;
        else if(new Date(b.Created).getTime()>new Date(a.Created).getTime())  return  1;
        else return  0;
      });
      this.totalCount=this.listItems.length;
      this.dataSource = new MatTableDataSource(this.listItems);
    }

    private initializePaginator() {
      this.paginator.page.subscribe((event:PageEvent) => {
          this.updatePageData(event);
          this.paginator.length=this.totalCount;
          this.paginator.pageIndex=this.currentPage-1;
          this.paginator.pageSize=this.itemsPerPage;
        }
      );
      this.dataSource.paginator = this.paginator;
    }

    public getDisplayedColumns(){
      return ['Created', 'Description'];
    }

}
