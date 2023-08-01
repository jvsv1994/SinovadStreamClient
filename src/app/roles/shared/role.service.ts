import { EventEmitter, Injectable } from '@angular/core';
import { Role } from './role.model';

export declare type EventHandler = (...args: any[]) => any;

@Injectable({ providedIn: 'root' })
export class RoleService {

  showModalEvent=new EventEmitter<Role>();
  refreshListEvent=new EventEmitter<boolean>();

  constructor(
  ) {
  }

  public showModal(role:Role){
    this.showModalEvent.emit(role);
  }

  public refreshList(){
    this.refreshListEvent.emit(true);
  }


}
