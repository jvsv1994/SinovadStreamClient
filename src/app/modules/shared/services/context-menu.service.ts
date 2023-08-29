import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, ViewRef } from '@angular/core';
import { ContextMenuOption, CustomContextMenuComponent } from '../components/custom-context-menu/custom-context-menu.component';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class ContextMenuService {

  lastViewRef:ViewRef;

  constructor(private factoryResolver: ComponentFactoryResolver, private injector: Injector,
    private applicationRef: ApplicationRef) {
    }

    public show(containerId:string,left:number,top:number,listOptions:ContextMenuOption[]):Promise<any>{
      return new Promise((resolve, reject) => {
        if(this.lastViewRef!=undefined)
        {
          this.applicationRef.detachView(this.lastViewRef);
        }

        const factory = this.factoryResolver.resolveComponentFactory(CustomContextMenuComponent);

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
        component.instance.left=left;
        component.instance.top=top;
        component.instance.listOptions=listOptions;
        component.instance.clickOption.subscribe((option:ContextMenuOption) => {
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
          resolve(option);
        });
        component.instance.hideContextMenu.subscribe(event => {
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
          reject(true);
        });
        const renderedHtml = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        var container=document.getElementById(containerId);
        container.appendChild(renderedHtml);
      });
    }

}
