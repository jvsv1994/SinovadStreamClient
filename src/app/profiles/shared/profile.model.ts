import { SafeUrl } from "@angular/platform-browser";

export class Profile{

   Id?: number;
   UserId?: number;
   FullName?: string;
   Main?: Boolean;
   Pincode?: number;
   AvatarPath?: string;
   BlobUrl?: SafeUrl;
}
