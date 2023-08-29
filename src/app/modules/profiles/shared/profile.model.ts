import { SafeUrl } from "@angular/platform-browser";

export class Profile{

   Id?: number;
   Guid?: string;
   UserId?: number;
   FullName?: string;
   Main?: Boolean;
   Pincode?: number;
   AvatarPath?: string;
   BlobUrl?: SafeUrl;
}
