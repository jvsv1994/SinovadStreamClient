export class Menu{

  Id?: number;
  Path?: string;
  SortOrder?: number;
  Title?: string;
  IconUrl?: string;
  IconClass?: string;
  IconTypeCatalogId?: number;
  IconTypeCatalogDetailId?: number;
  ParentId?: number;
  Enabled?: boolean;
  ChildMenus?: Menu[];
  isCollapsed?:boolean;
  MediaServerId?:number;
  MediaServerGuid?:string;
  IsSecureConnection?:boolean;
}
