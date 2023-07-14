import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class EventsService {

  public subjectEvent = new Subject<any>();

  constructor(
  ) {
  }

  public openContextMenu(contextMenuOptions):void{

  };

}
