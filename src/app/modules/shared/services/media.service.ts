
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MediaService {

  private updateMediaItems$ = new Subject<boolean>();

  constructor() {
  }

  public updateMediaItems():void{
    this.updateMediaItems$.next(true);
  };

  public isUpdatingMediaItems():Observable<boolean>{
    return this.updateMediaItems$.asObservable();
  }

}
