import { SidebarOption } from "./sidebarOption";


export class SidebarModule{
   index?: number;
   name?:string;
   order?: number;
   listOptions?: SidebarOption[];
   isCollapsed?:boolean;
}
