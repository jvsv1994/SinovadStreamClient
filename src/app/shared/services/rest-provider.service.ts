import { Injectable } from '@angular/core';
import { SharedService } from './shared-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpMethodType } from 'src/app/shared/enums';

@Injectable({ providedIn: 'root' })
export class RestProviderService {

  constructor(
    public http: HttpClient,
    public sharedService: SharedService
  ) {
  }

  private performExecuteMethod(methodType:HttpMethodType,link:string,body?:any): Promise<any>{
    return new Promise((resolve, reject) => {
      try{
        let requestOptions:any={
          responseType: 'text'
        }
        if(this.sharedService.apiToken)
        {
          let api_key = this.sharedService.apiToken;
          const headers = new HttpHeaders({
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+api_key
          });
          requestOptions.headers=headers;
        }
        if(methodType==HttpMethodType.GET)
        {
          this.http.get(link,requestOptions).subscribe((response: any) => {
            resolve(response);
          },error=>{
            reject(error);
          });
        }
        if(methodType==HttpMethodType.POST)
        {
          this.http.post(link,body,requestOptions).subscribe((response: any) => {
            resolve(response);
          },error=>{
            reject(error);
          });
        }
        if(methodType==HttpMethodType.PUT)
        {
          this.http.put(link,body,requestOptions).subscribe((response: any) => {
            resolve(response);
          },error=>{
            reject(error);
          });
        }
        if(methodType==HttpMethodType.DELETE)
        {
          this.http.delete(link,requestOptions).subscribe((response: any) => {
            resolve(response);
          },error=>{
            reject(error);
          });
        }
      }catch(error)
      {
        reject(error);
      }
    });
  }

  public executeSinovadApiService(methodType:HttpMethodType,routePath:string,body?:any): Promise<any>{
    let link=this.sharedService.urlSinovadStreamWebApi+"/api/v1"+routePath;
    return new Promise((resolve, reject) => {
      try{
        this.performExecuteMethod(methodType,link,body).then((response: any) => {
          resolve(JSON.parse(response));
        },error=>{
          let finalError=error;
          if(error.error!=null)
          {
            finalError=error.error;
            try{
              var errorData=JSON.parse(finalError);
              if(errorData.errors)
              {
                let errors=errorData.errors;
                let listErrors=[];
                Object.keys(errors).map((key) => {
                  var errorResult=errors[key].join("\n");
                  listErrors.push(errorResult);
                });
                finalError=listErrors.join("\n");
              }else if(errorData.Errors){
                var listErrors=errorData.Errors.map(item => item.ErrorMessage);
                finalError=listErrors.join("\n");
              }else if(errorData.Message)
              {
                finalError=errorData.Message;
              }
            }catch(e)
            {

            }
          }
          if(error.status==401)
          {
            if(this.sharedService.apiToken)
            {
              this.sharedService.apiToken=undefined;
              localStorage.removeItem('apiToken');
              (<any>window).location.href = '/';
            }
          }
          console.error(finalError);
          reject(finalError);
        });
      }catch(error)
      {
        reject(error);
      }
    });
  }

  public executeHttpMediaServerApi(methodType:HttpMethodType,url:string,body?:any): Promise<any>{
    return new Promise((resolve, reject) => {
      try{
        this.performExecuteMethod(methodType,url,body).then((response: any) => {
          try{
            resolve(JSON.parse(response));
          }catch(error){
            reject(error);
          }
        },error=>{
          reject(error);
        });
      }catch(error)
      {
        reject(error);
      }
    });
  }

  public executeHttpMethodByUrl(methodType:HttpMethodType,url:string,body?:any): Promise<any>{
    return new Promise((resolve, reject) => {
      this.performExecuteMethod(methodType,url,body).then((response: any) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

  public executeHttpPostMethodWithFormData(routePath:string,formData:FormData): Promise<any>{
    let link=this.sharedService.urlSinovadStreamWebApi+"/api/v1"+routePath;
    return new Promise((resolve, reject) => {
      let requestOptions:any={
        responseType: 'text'
      }
      if(this.sharedService.apiToken)
      {
        let api_key = this.sharedService.apiToken;
        const headers = new HttpHeaders({
          'Accept': '*/*',
          'Authorization': 'Bearer '+api_key
        });
        requestOptions.headers=headers;
      }
      this.http.post(link,formData,requestOptions).subscribe((response: any) => {
        resolve(response);
      },error=>{
        reject(error);
      });
    });
  }

}
