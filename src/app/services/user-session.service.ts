import { Injectable } from '@angular/core';
import lo_ from 'lodash';
import { map } from 'rxjs/operators';
import { CoreApiTypes } from './api-types';
import { UserApiService } from './user-api.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  loggedInUser: any = {};
  broadCastUser: any;
  userToView: any = {}

  constructor(
    private userApiService: UserApiService,
    private router: Router,
  ) { }
  


   userLogIn(params: CoreApiTypes.Login) {
     return this.userApiService.authenticate(params)
     .pipe(
       map(res => {
         if (res.status) {
          this.sessionToken = res.token;
          this.setUserData(res.data)
         }
         return res;
       })
     )
   }

   userSignup(params: CoreApiTypes.Login) {
    return this.userApiService.createUser(params)
    .pipe(
      map(res => {
        if (res.status) {
         this.sessionToken = res.token;
         this.setUserData(res.data)
        }
        return res;
      })
    )
  }
   
   getDefaultRoute() {
    return ['/dashboard']
   }



   isTokenAvailable () {
    return (!!sessionStorage.getItem('sessionToken'))
   }

   isCurrentUserDataEmpty() {
    return lo_.isEmpty(this.loggedInUser);
   }


   setUserData(currentUser) {
    this.loggedInUser = currentUser;
    sessionStorage.setItem('loggedInUser', JSON.stringify(this.loggedInUser));
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
