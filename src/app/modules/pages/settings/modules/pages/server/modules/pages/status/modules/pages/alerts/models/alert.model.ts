import { AlertType } from "src/app/modules/shared/enums/enums";

export class Alert{
  Id:number;
  Description:string;
  AlertType:AlertType;
  Created:Date;
}
