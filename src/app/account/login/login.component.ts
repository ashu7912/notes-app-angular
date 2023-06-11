import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailPattern = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z+])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  public loginObject = {
    email: '',
    password: ''
  }
  errorMessage = '';

  constructor(
    private userSessionService: UserSessionService,
    private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if(this.userSessionService.isTokenAvailable()) {
      this.router.navigate(['/dashboard'])
    }
  }

  changeInput(event: any) {
    this.errorMessage = '';
  }

  login() {
    this.ngxLoader.start()
    this.userSessionService.userLogIn(this.loginObject)
    .subscribe((res) => {
      if(res.status) {
        this.toastrService.success(res.message);
        this.router.navigate(this.userSessionService.getDefaultRoute());
      } else {
        this.toastrService.error(res.message)
      }
    },
    (err) => {
      this.toastrService.error(err.message);
      this.ngxLoader.stop()
    },
    () => {
      this.ngxLoader.stop()
    })
  }
}
