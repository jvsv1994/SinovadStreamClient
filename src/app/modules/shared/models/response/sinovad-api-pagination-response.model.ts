import { SinovadApiGenericResponse } from "./sinovad-api-generic-response.model";

export class SinovadApiPaginationResponse extends SinovadApiGenericResponse{
  PageNumber: number;
  TotalPages: number;
  TotalCount:number;
  HasPreviousPage:boolean;
  HasNextPage:boolean;
}
