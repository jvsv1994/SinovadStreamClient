
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { ToastOptions } from './toastOptions';
import { ToastType } from './toastEnums';

@Component({
  selector: 'app-custom-toast',
  templateUrl: './custom-toast.page.html',
  styleUrls: ['./custom-toast.page.scss']
})
export class CustomToastPage implements OnInit {

  @ViewChild('toastContent') toastContent: TemplateRef<any>;
  toastOptions:ToastOptions;
  container:HTMLElement;
  renderedHtml:HTMLElement;
  isShowing:boolean=false;

  constructor(public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef) {


    }

    ngOnInit(): void {
    }

    ngAfterViewInit(){

    }

    public toastType(): typeof ToastType {
      return ToastType;
    }

    public show(toastOptions:ToastOptions){
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

    public hideToast(){
      if(this.container.contains(this.renderedHtml))
      {
        this.container.removeChild(this.renderedHtml);
      }
      this.isShowing=false;
      this.ref.detectChanges();
    }

}
