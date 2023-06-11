import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError as observableThrowError } from "rxjs";
import {catchError} from 'rxjs/operators';
import { UserSessionService } from "../services/user-session.service";

@Injectable() 

export class AuthInterceptorService implements HttpInterceptor{
    
  constructor(
    private _router: Router,
    private userSessionService: UserSessionService
  ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        const token = this.userSessionService.sessionToken;
        if(token) {
            const tokaniseReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${token}`)
            })

            return next.handle(tokaniseReq).
            pipe(
                catchError(
                    (err: HttpErrorResponse) => {
                        this._router.navigate(['/account']);
                        return observableThrowError(err);
                    }
                )
            )
        }
        return next.handle(request).
        pipe(
            catchError(
                (err: HttpErrorResponse) => {
                    this._router.navigate(['/account']);
                    return observableThrowError(err);
                }
            )
        )
    }
}