import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector, ViewRef } from '@angular/core';
import { DropDownMenuOptions } from './drop-down-menu-options.model';
import { DropDownMenuItem } from './drop-down-menu-Item.model';
import { DropDownServersComponent } from '../drop-down-servers/drop-down-servers.component';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class DropDownServersService {

  lastViewRef:ViewRef;
  isShowing:boolean=false;
  componentRef:ComponentRef<DropDownServersComponent<unknown>>;

  constructor(private factoryResolver: ComponentFactoryResolver, private injector: Injector,
    private applicationRef: ApplicationRef) {
    }

    public show<T>(dropDownMenuOptions:DropDownMenuOptions<T>):Promise<any>{
      return new Promise((resolve, reject) => {
        if(this.lastViewRef!=undefined)
        {
          this.applicationRef.detachView(this.lastViewRef);
        }

        const factory = this.factoryResolver.resolveComponentFactory(DropDownServersComponent);

        this.componentRef = factory.create(this.injector);
        // create an instance of the sample component
        this.lastViewRef= this.componentRef.hostView;
        // since we need to modify inputs on the component, we extract the instance and make our changes

        // we attach the component instance to the angular application reference
        // this step is necessary as it allows for our components view to be dirty-checked
        this.applicationRef.attachView( this.componentRef.hostView);

        // the step we have been building to
        // we pull the rendered node from the components host view
        let ctx=this;
        const rect = dropDownMenuOptions.target.getBoundingClientRect();
        this.componentRef.instance.dropDownMenuOptions=dropDownMenuOptions;
        this.componentRef.instance.left=rect.left;
        this.componentRef.instance.top=rect.top+rect.height;
        this.componentRef.instance.width=rect.width;
        this.componentRef.instance.clickItem.subscribe((option:DropDownMenuItem<T>) => {
          this.componentRef.destroy();
          ctx.applicationRef.detachView(this.componentRef.hostView);
          ctx.isShowing=false;
          resolve(option);
        });
        this.componentRef.instance.hide.subscribe(event => {
          this.componentRef.destroy();
          ctx.applicationRef.detachView(this.componentRef.hostView);
          ctx.isShowing=false;
          reject(true);
        });
        this.isShowing=true;
        const renderedHtml = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        var container=document.getElementById("sinovadMainContainer");
        container.appendChild(renderedHtml);
      });
    }

    public closeDropDown(){
      this.componentRef.instance.hide.emit(true);
    }

}
