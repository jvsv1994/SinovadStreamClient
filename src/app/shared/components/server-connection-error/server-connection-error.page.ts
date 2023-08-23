
import { ChangeDetectorRef, Component, Input, OnInit, ViewContainerRef} from '@angular/core';
import { MediaServer } from 'src/app/servers/shared/server.model';

@Component({
  selector: 'app-server-connection-error',
  templateUrl: './server-connection-error.page.html',
  styleUrls: ['./server-connection-error.page.scss']
})
export class ServerConnectionErrorPage implements OnInit {

  @Input() mediaServer:MediaServer;

  constructor() {

    }

    ngOnInit(): void {
    }

    ngAfterViewInit(){

    }

}
