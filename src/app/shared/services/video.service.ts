import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BuilderVideo } from 'src/models/builderVideo';

export declare type EventHandler = (...args: any[]) => any;

export class VideoEvent{
  isShowing:boolean;
  builderVideo?:BuilderVideo;
}

@Injectable({ providedIn: 'root' })
export class VideoService {

  public video$ = new Subject<VideoEvent>();
  constructor(
  ) {
  }

  public showVideo(event:VideoEvent):void{
    this.video$.next(event);
  };

  public getVideoEvent():Observable<VideoEvent>{
    return this.video$.asObservable();
  }

}
