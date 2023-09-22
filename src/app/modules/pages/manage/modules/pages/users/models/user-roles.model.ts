import { UserRole } from "./user-role.model";
import { User } from "./user.model";

export class UserWithRoles extends User{
  UserRoles:UserRole[];
}
