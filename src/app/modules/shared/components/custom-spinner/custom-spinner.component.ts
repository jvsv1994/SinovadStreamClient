
import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.component.html',
  styleUrls: ['./custom-spinner.component.scss']
})
export class CustomSpinnerComponent implements OnInit {

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
