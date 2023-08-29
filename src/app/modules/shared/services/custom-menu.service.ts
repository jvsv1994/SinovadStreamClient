import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, ViewRef } from '@angular/core';
import { EventEmitter } from "@angular/core";
import { CustomMenuComponent } from '../components/custom-menu/custom-menu.component';
export class CustomMenuItem{
  title:string;
  iconClass?:string;
  key?:string;
  eventOnSelectItem?:EventEmitter<boolean>;
}

export class CustomMenuConfiguration{
  containerId?:string;
  target?:HTMLElement;
  listItems:CustomMenuItem[];
}

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class CustomMenuService {

  lastViewRef:ViewRef;

  constructor(private factoryResolver: ComponentFactoryResolver, private injector: Injector,
    private applicationRef: ApplicationRef) {
    }

    public show(options:CustomMenuConfiguration):Promise<any>{
      return new Promise((resolve, reject) => {
        if(this.lastViewRef!=undefined)
        {
          this.applicationRef.detachView(this.lastViewRef);
        }

        const factory = this.factoryResolver.resolveComponentFactory(CustomMenuComponent);

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

        const rect = options.target.getBoundingClientRect();
        var right=(window.innerWidth-rect.right);
        var top=rect.top+rect.height;
        component.instance.options=options;
        component.instance.right=right;
        component.instance.top=top;
        component.instance.selectOption.subscribe((option:CustomMenuItem) => {
          if(option.eventOnSelectItem)
          {
            option.eventOnSelectItem.emit(true);
          }
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
          resolve(option);
        });
        component.instance.hide.subscribe(event => {
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
          reject(true);
        });
        const renderedHtml = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        var container=document.getElementById(options.containerId);
        container.appendChild(renderedHtml);
      });
    }

}
