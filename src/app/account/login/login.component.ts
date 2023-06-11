import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreApiTypes } from 'src/app/services/api-types';
import { UserSessionService } from 'src/app/services/user-session.service';
import { EMAIL_PATTERN } from 'src/app/shared/utilities';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  get email(): FormControl {
    return <FormControl>this.loginForm.get('email');
  }

  get password(): FormControl {
    return <FormControl>this.loginForm.get('password');
  }

  constructor(
    private userSessionService: UserSessionService,
    private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      password: new FormControl('', Validators.required)
    });
  }


  submitLogin() {
    if (!this.loginForm.valid) {
      return;
    }
    const params = { ...this.loginForm.value }
    this.ngxLoader.start()
    this.userSessionService.userLogIn(params)
      .subscribe((res: CoreApiTypes.UserWithToken) => {
        if (res.status) {
          this.toastrService.success(res.message);
          this.router.navigate(this.userSessionService.getDefaultRoute());
        } else {
          this.toastrService.error(res.message)
        }
      },
        (e) => {
          this.toastrService.error(e.error.message);
          this.ngxLoader.stop()
        },
        () => {
          this.ngxLoader.stop()
        })
  }

  goToSignup() {
    this.router.navigate(['/account/signup'])
  }
}
