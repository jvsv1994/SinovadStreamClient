import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BuilderVideo } from 'src/models/builderVideo';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class VideoService {

  public video$ = new Subject<BuilderVideo>();

  constructor(
  ) {
  }

  public showVideo(video:BuilderVideo):void{
    this.video$.next(video);
  };

  public getVideo():Observable<BuilderVideo>{
    return this.video$.asObservable();
  }

}
