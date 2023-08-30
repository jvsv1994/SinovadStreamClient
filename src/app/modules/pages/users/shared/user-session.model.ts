import { MediaServer } from "src/app/modules/pages/servers/shared/server.model";
import { User } from "./user.model";
import { Profile } from "src/app/modules/pages/profiles/shared/profile.model";
import { LinkedAccount } from "src/app/modules/shared/models/linked-account.model";

export class UserSession{
  User: User;
  MediaServers:MediaServer[];
  Profiles:Profile[];
  LinkedAccounts:LinkedAccount[];
}

