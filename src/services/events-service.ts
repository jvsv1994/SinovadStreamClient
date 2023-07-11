import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class EventsService {

  public subjectEvent = new Subject<any>();

  constructor(
  ) {
  }

  public publish(keyEvent: any,params?:any):void{
      this.subjectEvent.next({keyEvent:keyEvent,params:params});
  };

}
