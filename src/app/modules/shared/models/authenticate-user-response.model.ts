import { User } from "src/app/modules/users/shared/user.model";
import { ConfirmLinkAccount } from "./confirm-linked-account.model";
import { UserSession } from "src/app/modules/users/shared/user-session.model";

export class AuthenticationUserResponse{
  ApiToken: string;
  UserData: UserSession;
  ConfirmLinkAccountData:ConfirmLinkAccount
}
