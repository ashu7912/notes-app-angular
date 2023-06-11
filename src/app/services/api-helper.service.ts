import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import lo_ from 'lodash';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  coreApiBaseUrl = '';

  constructor() {
    this.coreApiBaseUrl = environment.coreApiBaseUrl;
  }


  getCoreApiUrl(urlPath: string) {
    return this.coreApiBaseUrl + urlPath;
  }

  convertToHttpParams(params: any) {
    if (params) {
      const paramsObject = lo_.cloneDeep(params);
      return new HttpParams({ fromObject: paramsObject })
    }
  }
}
