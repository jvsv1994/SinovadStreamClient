import { MediaType } from "../Enums";


export class Storage{

  public Id?: number;
  public MediaServerId?:number;
  public PhysicalPath: string;
  public MediaType: MediaType;
  public ListPaths?: string[];

}
