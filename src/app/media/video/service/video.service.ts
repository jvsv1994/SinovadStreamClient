import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injectable, Injector, ViewRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BuilderVideo } from '../models/builderVideo';
import { VideoPage } from '../component/video.page';
import { Router } from '@angular/router';

export declare type EventHandler = (...args: any[]) => any;

export class VideoEvent{
  isShowing:boolean;
  builderVideo?:BuilderVideo;
}

@Injectable({ providedIn: 'root' })
export class VideoService {

  public video$ = new Subject<VideoEvent>();
  lastViewRef:ViewRef;

  constructor(private router: Router,
    private factoryResolver: ComponentFactoryResolver, private injector: Injector,
    private applicationRef: ApplicationRef) {
    }

    public show(builderVideo:BuilderVideo){
        if(this.lastViewRef!=undefined)
        {
          this.applicationRef.detachView(this.lastViewRef);
        }
        const factory = this.factoryResolver.resolveComponentFactory(VideoPage);

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
        component.instance.builderVideo=builderVideo;
        component.instance.outputCloseVideo.subscribe(event => {
          ctx.router.navigateByUrl("/home");
          component.destroy();
          ctx.applicationRef.detachView(component.hostView);
        });
        const renderedHtml = (component.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        var container=document.getElementById("sinovadMainContainer");
        container.appendChild(renderedHtml);
    }
}
