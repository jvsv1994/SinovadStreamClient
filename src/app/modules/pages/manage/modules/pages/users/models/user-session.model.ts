import { User } from "./user.model";
import { MediaServer } from "../../servers/models/server.model";
import { LinkedAccount } from "src/app/modules/pages/login/models/linked-account.model";
import { Profile } from "src/app/modules/pages/profiles/models/profile.model";
import { Role } from "../../roles/models/role.model";
import { Menu } from "../../menus/models/menu.model";

export class UserSession{
  User: User;
  MediaServers:MediaServer[];
  Profiles:Profile[];
  Roles:Role[];
  LinkedAccounts:LinkedAccount[];
  Menus:Menu[];

}

