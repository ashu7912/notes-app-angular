import { Injectable } from "@angular/core";
import {
  HttpClient,
} from "@angular/common/http";
import { Observable, throwError as observableThrowError } from "rxjs";
import { ApiHelperService } from "./api-helper.service";

@Injectable({
  providedIn: "root",
})
export class ResourceService<T> {

  constructor(
    private _httpClient: HttpClient,
    private apiHelper: ApiHelperService
    ) {
  }

  get(endpoint: string, params?): Observable<T> {
    const httpParams = this.apiHelper.convertToHttpParams(params);
    return this._httpClient
      .get<any>(this.apiHelper.getCoreApiUrl(endpoint), { params: httpParams })
  }

  post(endpoint: string, item?: T, params?): Observable<any> {
    const httpParams = this.apiHelper.convertToHttpParams(params);
    return this._httpClient
      .post(this.apiHelper.getCoreApiUrl(endpoint), item, { params: httpParams })
  }

  delete(endpoint: string): Observable<any> {
    return this._httpClient
      .delete(this.apiHelper.getCoreApiUrl(endpoint));
  }
}
