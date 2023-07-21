
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import { CustomActionsMenuOptions } from './customActionsOptions';
import { CustomActionsMenuItem } from './customActionsMenuItem';

@Component({
  selector: 'app-custom-actions-menu',
  templateUrl: './custom-actions-menu.page.html',
  styleUrls: ['./custom-actions-menu.page.scss']
})
export class CustomActionsMenuPage implements OnInit {

  @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
  @Output() onHide=new EventEmitter();;
  options:CustomActionsMenuOptions;
  container:HTMLElement;
  renderedHtml:HTMLElement;
  isShowing:boolean=false;
  right:number;
  top:number;

  constructor(public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef) {


    }

    ngOnInit(): void {
    }

    ngAfterViewInit(){

    }

    public show(options:CustomActionsMenuOptions){
      this.options=options;
      const rect = options.target.getBoundingClientRect();
      this.right=(window.innerWidth-rect.right);
      this.top=rect.top+rect.height;
      this.container=document.getElementById(options.containerId);
      var embeddedViewRef=this.viewContainerRef.createEmbeddedView(this.contentTemplate);
      this.renderedHtml=embeddedViewRef.rootNodes[0] as HTMLElement;
      this.container.appendChild(this.renderedHtml);
      setTimeout(() => {
        this.isShowing=true;
        this.ref.detectChanges();
      }, 100);
    }

    public hide(){
      this.onHide.emit(true);
      if(this.container.contains(this.renderedHtml))
      {
        this.container.removeChild(this.renderedHtml);
      }
      this.isShowing=false;
      this.ref.detectChanges();
    }

    public onSelectItem(item:CustomActionsMenuItem){
      this.hide();
      item.eventOnSelectItem.emit();
    }

}
