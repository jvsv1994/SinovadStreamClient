
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.page.html',
  styleUrls: ['./custom-spinner.page.scss']
})
export class CustomSpinnerPage implements OnInit,OnDestroy {

  @Input() showLoading:boolean=false;
  subscriptionSpinner:Subscription;

  constructor(
    public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {
    }

    public ngOnDestroy(): void {
      this.subscriptionSpinner.unsubscribe();
    }

    ngAfterViewInit(){

    }

}
