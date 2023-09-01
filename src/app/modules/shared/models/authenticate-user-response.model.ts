import { UserSession } from "../../pages/manage/modules/pages/users/models/user-session.model";
import { ConfirmLinkAccount } from "./confirm-linked-account.model";

export class AuthenticationUserResponse{
  ApiToken: string;
  UserData: UserSession;
  ConfirmLinkAccountData:ConfirmLinkAccount
}
