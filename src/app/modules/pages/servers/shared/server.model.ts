import { Library } from "src/app/modules/pages/libraries/shared/library.model";

export class MediaServer{
  public Id?: number;
  public Guid?:string;
  public SecurirtyIdentifier:string;
  public IpAddress:string;
  public PublicIpAddress:string;
  public UserId: number;
  public StateCatalogId: number;
  public StateCatalogDetailId: number;
  public Url?: string;
  public Port?:number;
  public FamilyName?:string;
  public DeviceName?:string;
  public isSecureConnection?:boolean;
  public lastConnection?:Date;
  public ListLibraries:Library[];
}
