import { SinovadApiGenericResponse } from "./sinovadApiGenericResponse";

export class SinovadApiPaginationResponse extends SinovadApiGenericResponse{
  PageNumber: number;
  TotalPages: number;
  TotalCount:number;
  HasPreviousPage:boolean;
  HasNextPage:boolean;
}
