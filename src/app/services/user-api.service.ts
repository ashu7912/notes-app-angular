import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiHelperService } from './api-helper.service';
import { CoreApiTypes } from './api-types';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private http: HttpClient,
    private apiHelper: ApiHelperService
    ) { }


  authenticate(params: CoreApiTypes.Login) {
    return this.http.post<any>(this.apiHelper.getCoreApiUrl('/users/login'), params);
  }

  getCurrentUser() {
    return this.http.get<any>(this.apiHelper.getCoreApiUrl('/users/currentUser'));
  }

  getEmployees(params: CoreApiTypes.GetAllEmployees) {
    const httpParams = this.apiHelper.convertToHttpParams(params)
    return this.http.get<any>(this.apiHelper.getCoreApiUrl('/users/get'), {params: httpParams});
  }

  updateUser(params) {
    return this.http.post<any>(this.apiHelper.getCoreApiUrl('/users/updateUser'), params);
  }
}
