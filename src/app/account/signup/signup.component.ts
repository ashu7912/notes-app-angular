import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CoreApiTypes } from 'src/app/services/api-types';
import { UserSessionService } from 'src/app/services/user-session.service';
import { EMAIL_PATTERN } from 'src/app/shared/utilities';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  get firstname(): FormControl {
    return <FormControl>this.signupForm.get('firstname');
  }

  get lastname(): FormControl {
    return <FormControl>this.signupForm.get('lastname');
  }

  get email(): FormControl {
    return <FormControl>this.signupForm.get('email');
  }

  get dob(): FormControl {
    return <FormControl>this.signupForm.get('dob');
  }

  get password(): FormControl {
    return <FormControl>this.signupForm.get('password');
  }

  get confirmPassword(): FormControl {
    return <FormControl>this.signupForm.get('confirmPassword');
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
    this.signupForm = new FormGroup({
      firstname: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      dob: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required)
    });
  }

  submitSignup() {
    if (!this.signupForm.valid) {
      return;
    }
    if (this.password.value != this.confirmPassword.value) {
      this.confirmPassword.setErrors({
        unMatched: true
      })
      return;
    }

    const params = { ...this.signupForm.value }
    delete params.confirmPassword;
    // params.dob = "1993-09-13";
    this.ngxLoader.start()
    this.userSessionService.userSignup(params)
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

  goToLogin() {
    this.router.navigate(['/account/login'])
  }

  
}
