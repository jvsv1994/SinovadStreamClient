

export class SidebarOption{
  index?: number;
  name?: string;
  method?: string;
  iconClass?: string;
  platform?: string;
  path?:string;
  order?: number;
  listOptions?: SidebarOption[];
  isCollapsed?:boolean;
}
