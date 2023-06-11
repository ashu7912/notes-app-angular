import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSessionService } from '../services/user-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userSessionService: UserSessionService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.userSessionService.isTokenAvailable()) {
        if(this.userSessionService.isCurrentUserDataEmpty()) {
          this.userSessionService.getCurrentUser()
        }
      } else {
        this.router.navigate(['/account/login'])
      }
    return this.userSessionService.isTokenAvailable();
  }
  
}
