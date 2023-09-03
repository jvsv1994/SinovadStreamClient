import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedDataService } from 'src/app/services/shared-data.service';
@Pipe({
    name: 'formatDataPipe'
})
export class FormatDataPipe implements PipeTransform {

    constructor(public domSanitizer: DomSanitizer,
      private sharedService: SharedDataService) {
    }
    transform(input: any, ...args: any[]):Promise<any> {
      return new Promise((resolve, reject) => {
        let type = args[0] != undefined ? args[0] : '';
        let output;
        switch (type) {
          case "GetIconURLByKey":{
            if (input != undefined && input != '') {
              if(this.sharedService.configurationData.developerMode)
              {
                output = "assets/icon/"+input;
              }else{
                output = this.sharedService.urlSinovadCdn+"/assets/icon/"+input;
              }
              resolve(output);
            }
            break;
          }
          case "GetAvatarImageURLByProfileId":{
            if (input != undefined && input != '') {
                var url=this.sharedService.urlSinovadStreamWebApi+"/api/v1/documents/GetAvatarProfile/"+input;
                fetch(url)
                .then(res => res.blob()) // Gets the response and returns it as a blob
                .then(blob => {
                  output=this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
                  resolve(output);
              });
            }
            break;
          }
          case "GetSoundUrlByKey":{
            if (input != undefined && input != '') {
              if(this.sharedService.configurationData.developerMode)
              {
                output = "assets/sound/"+input;
              }else{
                output = this.sharedService.urlSinovadCdn+"/assets/sound/"+input;
              }
              resolve(output);
            }
            break;
          }
          default: {
            break;
          }
        }

      });
  }

}
