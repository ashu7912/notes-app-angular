import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import lo_ from 'lodash';
import { map } from 'rxjs/operators';
import { CoreApiTypes } from './api-types';
import { UserApiService } from './user-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppEventService } from './app.event.service';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  loggedInUser: any = {};
  broadCastUser: any;
  userToView: any = {}

  constructor(
    private userApiService: UserApiService,
    private toastrService: ToastrService,
    private router: Router,
    private appEventService: AppEventService
  ) { }

  /**
   * 
   * designationId values - 
   * 1 - 'CEO/CMO' - Master User
   * 2 - 'Branch Manager'
   * 3 - 'Manager'
   * 4 - 'Employee'
   */
  
  /**
   * 
   * branchId values - 
   * 1 - 'Pune' - Head Office
   * 2 - 'Kolkata' - Branch
   * 3 - 'Bengaluru' - Branch
   * 4 - 'Chennai' - Branch
   */  


   userLogIn(params: CoreApiTypes.Login) {
     return this.userApiService.authenticate(params)
     .pipe(
       map(res => {
         if (res.status) {
          this.sessionToken = res.data.authorizationToken;
          this.setUserData(res.data.currentUser)
         }
         return res;
       })
     )
   }
   
   getDefaultRoute() {
    if(this.getDesignationId()!=4) {
      return ['/dashboard/users-list']
    }
    return ['/dashboard/users-profile']
   }

   getCurrentUser() {
    this.userApiService.getCurrentUser()
    .subscribe((res) => {
     if (res.status) {
      this.setUserData(res.data)
     } else {
       this.toastrService.error(res.message)
     }
   },
   (err) => {
     this.toastrService.error(err.message)
   })
   return true;
  }


   isTokenAvailable () {
    return (!!sessionStorage.getItem('sessionToken'))
   }

   isCurrentUserDataEmpty() {
    return lo_.isEmpty(this.loggedInUser);
   }


   setUserData(currentUser) {
    this.loggedInUser = currentUser;
    this.appEventService.broadcast('loggedInUser', this.loggedInUser);
    sessionStorage.setItem('userDesignationId', this.loggedInUser.designationId)
    sessionStorage.setItem('branchId', this.loggedInUser.branchId)
   }
   

  getDesignationId() {
    return +sessionStorage.getItem('userDesignationId')
  }

  getBranchId() {
    return +sessionStorage.getItem('branchId')
  }
   

   get sessionToken() {
    return sessionStorage.getItem('sessionToken');
  }

  set sessionToken(sessionToken: string) {
    if (sessionToken === undefined) {
      sessionStorage.removeItem('sessionToken');
    } else {
      sessionStorage.setItem('sessionToken', sessionToken);
    }
  }
  //  sessionRedirection() {
  //    if(this.sessionToken === undefined) {
  //      return ['/account/login']
  //    } else {
  //      return this.getDefaultRoute();
  //    }
  //  }
   getDesignation() {
    switch (this.getDesignationId()) {
        case 1: {
            return 'Master User'
        }
        case 2: {
            return 'Branch Manager'
        }
        case 3: {
            return 'Manager'
        }
        case 4: {
            return 'Employee'
        }
    }
}

setUserToView(user) {
  this.userToView = user;
}

getUserToView() {
  return this.userToView;
}

logout() {
  setTimeout(() => {
    sessionStorage.clear();
    this.loggedInUser = {};
    this.router.navigate(['/account'])
  },1000)
}
}
