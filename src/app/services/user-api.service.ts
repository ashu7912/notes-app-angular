import { Injectable } from '@angular/core';
import { CoreApiTypes } from './api-types';
import { ResourceService } from './resource.service';
import { ApiEndpoints, ExtendedEndpoints } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private resourceService: ResourceService<any>
    ) { }


  authenticate(params: CoreApiTypes.Login) {
    return this.resourceService.post(ApiEndpoints.users+ExtendedEndpoints.login, params)
  }

  createUser(params: CoreApiTypes.Login) {
    return this.resourceService.post(ApiEndpoints.users, params)
  }
  
  getOtherUsers() {
    return this.resourceService.get(ApiEndpoints.users)
  }
}
