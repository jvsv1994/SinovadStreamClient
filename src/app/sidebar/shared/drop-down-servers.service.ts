import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, ViewRef } from '@angular/core';
import { DropDownMenuOptions } from './drop-down-menu-options.model';
import { DropDownMenuItem } from './drop-down-menu-Item.model';
import { DropDownServersComponent } from '../drop-down-servers/drop-down-servers.component';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class DropDownServersService {

  lastViewRef:ViewRef;
  isShowing:boolean=false;

  constructor(private factoryResolver: ComponentFactoryResolver, private injector: Injector,
    private applicationRef: ApplicationRef) {
    }

    public show(dropDownMenuOptions:DropDownMenuOptions):Promise<any>{
      return new Promise((resolve, reject) => {
        if(this.lastViewRef!=undefined)
        {
          this.applicationRef.detachView(this.lastViewRef);
        }

        const factory = this.factoryResolver.resolveComponentFactory(DropDownServersComponent);

        const component = factory.create(this.injector);
        // create an instance of the sample component
        this.lastViewRef=component.hostView;
        // since we need to modify inputs on the component, we extract the instance and make our changes

        // we attach the component instance to the angular application reference
        // this step is necessary as it allows for our components view to be dirty-checked
        this.applicationRef.attachView(component.hostView);

        // the step we have been building to
        // we pull the rendered node from the components host view
        let ctx=this;
        const rect = dropDownMenuOptions.target.getBoundingClientRect();
        component.instance.dropDownMenuOptions=dropDownMenuOptions;
        component.instance.left=rect.left;
        component.instance.top=rect.top+rect.height;
        component.instance.width=rect.width;
        component.instance.clickItem.subscribe((option:DropDownMenuItem) => {
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
          ctx.isShowing=false;
          resolve(option);
        });
        component.instance.hide.subscribe(event => {
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
          ctx.isShowing=false;
          reject(true);
        });
        this.isShowing=true;
        const renderedHtml = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        var container=document.getElementById("sinovadMainContainer");
        container.appendChild(renderedHtml);
      });
    }

}
