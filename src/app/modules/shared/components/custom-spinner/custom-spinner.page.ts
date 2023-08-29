
import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.page.html',
  styleUrls: ['./custom-spinner.page.scss']
})
export class CustomSpinnerPage implements OnInit {

  @Input() showLoading:boolean=false;

  constructor(
    public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {
    }

    ngAfterViewInit(){

    }

}
