import { User } from "src/app/users/shared/user.model";
import { ConfirmLinkAccount } from "./confirm-linked-account.model";

export class AuthenticationUserResponse{
  ApiToken: string;
  User: User;
  ConfirmLinkAccountData:ConfirmLinkAccount
}
