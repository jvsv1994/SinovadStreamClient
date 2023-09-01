
import { Component, Input} from '@angular/core';
import { MediaServer } from 'src/app/modules/pages/manage/modules/pages/servers/models/server.model';

@Component({
  selector: 'app-server-connection-error',
  templateUrl: './server-connection-error.page.html',
  styleUrls: ['./server-connection-error.page.scss']
})
export class ServerConnectionErrorPage {

  @Input() mediaServer:MediaServer;

  constructor() {

    }


}
