
import { Component, Input} from '@angular/core';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';

@Component({
  selector: 'app-server-connection-error',
  templateUrl: './server-connection-error.component.html',
  styleUrls: ['./server-connection-error.component.scss']
})
export class ServerConnectionErrorComponent {

  @Input() mediaServer:MediaServer;

  constructor() {

    }


}
