import { MediaServer } from "src/app/servers/shared/server.model";
import { User } from "./user.model";
import { Profile } from "src/app/profiles/shared/profile.model";
import { LinkedAccount } from "src/app/shared/models/linked-account.model";

export class UserSession{
  User: User;
  MediaServers:MediaServer[];
  Profiles:Profile[];
  LinkedAccounts:LinkedAccount[];
}

