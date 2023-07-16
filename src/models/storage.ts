import { MediaType } from "../app/enums";


export class Storage{

  public Id?: number;
  public MediaServerId?:number;
  public PhysicalPath: string;
  public MediaTypeCatalogId: number;
  public MediaTypeCatalogDetailId: number;
  public ListPaths?: string[];

}