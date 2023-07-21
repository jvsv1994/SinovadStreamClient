
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { ConfirmDeleteMessageBoxOptions } from './confirmDeleteMessageBoxOptions';

@Component({
  selector: 'app-confirm-delete-message-box',
  templateUrl: './confirm-delete-message-box.page.html',
  styleUrls: ['./confirm-delete-message-box.page.scss']
})
export class ConfirmDeleteMessageBoxPage implements OnInit {

  @Output() confirm=new EventEmitter();
  @ViewChild('template') template: TemplateRef<any>;
  options:ConfirmDeleteMessageBoxOptions;
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

    public show(options:ConfirmDeleteMessageBoxOptions){
      this.options=options;
      this.container=document.getElementById(options.containerId);
      var embeddedViewRef=this.viewContainerRef.createEmbeddedView(this.template);
      this.renderedHtml=embeddedViewRef.rootNodes[0] as HTMLElement;
      this.container.appendChild(this.renderedHtml);
      this.isShowing=true;
      this.ref.detectChanges();
    }

    public hide(){
      if(this.container.contains(this.renderedHtml))
      {
        this.container.removeChild(this.renderedHtml);
      }
      this.isShowing=false;
      this.ref.detectChanges();
    }

    public confirmDelete(){
      this.hide();
      this.options.confirmEvent.emit(true);
    }

}
