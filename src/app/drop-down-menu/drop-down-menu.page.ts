

import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef, ViewRef} from '@angular/core';
import { DropDownMenuOptions } from './dropDownMenuOptions';
import { DropDownMenuItem } from './dropDownMenuItem';
@Component({
  selector: 'app-drop-down-menu',
  templateUrl: './drop-down-menu.page.html'
})
export class DropDownMenuPage{

  @ViewChild('dropDownMenuContent') dropDownMenuContent: TemplateRef<any>;
  lastViewRef:ViewRef;
  @Output() clickItem =new EventEmitter();
  @Input() dropDownMenuOptions:DropDownMenuOptions;
  isShowing:boolean=false;
  container:HTMLElement;
  renderedHtml:HTMLElement;

  constructor(
    public ref:ChangeDetectorRef,
    public viewContainerRef: ViewContainerRef
  ) {

  }

  public show(dropDownMenuOptions:DropDownMenuOptions){
    this.isShowing=true;
    this.ref.detectChanges();
    this.dropDownMenuOptions=dropDownMenuOptions;
    this.container=document.getElementById(dropDownMenuOptions.containerId);
    var embeddedViewRef=this.viewContainerRef.createEmbeddedView(this.dropDownMenuContent);
    this.renderedHtml=embeddedViewRef.rootNodes[0] as HTMLElement;
    this.container.appendChild(this.renderedHtml);
  }

  public onHide(){
    this.isShowing=false;
    if(this.container.contains(this.renderedHtml))
    {
      this.container.removeChild(this.renderedHtml);
    }
  }

  public onClickDropDownMenuItem(item:DropDownMenuItem){
    this.isShowing=false;
    if(this.container.contains(this.renderedHtml))
    {
      this.container.removeChild(this.renderedHtml);
    }
    this.clickItem.emit(item);
    this.ref.detectChanges();
  }

}
