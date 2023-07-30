
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastOptions, ToastService, ToastType } from 'src/services/toast.service';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.page.html',
  styleUrls: ['./custom-toast.page.scss']
})
export class CustomToastPage implements OnInit,OnDestroy {

  @ViewChild('toastContent') toastContent: TemplateRef<any>;
  toastOptions:ToastOptions;
  container:HTMLElement;
  renderedHtml:HTMLElement;
  isShowing:boolean=false;
  subscriptionToast:Subscription;

  constructor(
    private toastService:ToastService,
    public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef) {
      this.subscriptionToast=this.toastService.getToastEvent().subscribe((toastOptions:ToastOptions)=>{
        this.show(toastOptions);
      });
    }

    ngOnInit(): void {
    }

    public ngOnDestroy(): void {
      this.subscriptionToast.unsubscribe();
    }

    ngAfterViewInit(){

    }

    public toastType(): typeof ToastType {
      return ToastType;
    }

    private show(toastOptions:ToastOptions){
      this.toastOptions=toastOptions;
      this.container=document.getElementById(toastOptions.containerId);
      var embeddedViewRef=this.viewContainerRef.createEmbeddedView(this.toastContent);
      this.renderedHtml=embeddedViewRef.rootNodes[0] as HTMLElement;
      this.container.appendChild(this.renderedHtml);
      this.isShowing=true;
      this.ref.detectChanges();
      setTimeout(() => {
        this.hideToast();
      }, toastOptions.displayTime);
    }

    private hideToast(){
      if(this.container.contains(this.renderedHtml))
      {
        this.container.removeChild(this.renderedHtml);
      }
      this.isShowing=false;
      this.ref.detectChanges();
    }

}
