import { Pipe, PipeTransform } from '@angular/core';
import { SharedDataService } from '../services/shared-data.service';
@Pipe({
    name: 'formatDataPipe'
})
export class FormatDataPipe implements PipeTransform {

    constructor(private sharedData: SharedDataService) {
    }
    transform(input: any, ...args: any[]) {

    let type = args[0] != undefined ? args[0] : '';

    let output = '';
    switch (type) {

      case "GetImageURLByKey":{
        if (input != undefined && input != '') {
          if(this.sharedData.configurationData.developerMode)
          {
            output = "assets/icon/"+input;
          }else{
            output = this.sharedData.urlSinovadBackEnd+"/assets/icon/"+input;
          }
        }
        break;
      }
      case "GetSoundUrlByKey":{
        if (input != undefined && input != '') {
          if(this.sharedData.configurationData.developerMode)
          {
            output = "assets/sound/"+input;
          }else{
            output = this.sharedData.urlSinovadBackEnd+"/assets/sound/"+input;
          }
        }
        break;
      }
      default: {
        break;
      }
    }
    return output;
  }
}
