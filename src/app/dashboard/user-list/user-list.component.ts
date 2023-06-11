import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';
import { AppEventService } from 'src/app/services/app.event.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  loggedInUser: any = {};
  tableSubHeader = ''
  private userResponse: Subscription;

  usersArray: any = [];
  constructor(
    private userApiService: UserApiService,
    private userSessionService: UserSessionService,
    private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService,
    private appEventService: AppEventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllEmployees()
    this.loggedInUser = this.userSessionService.loggedInUser;
    this.userResponse = this.appEventService.subscribe('loggedInUser')
      .subscribe(
        (res) => {
          this.loggedInUser = res;
          this.tableSubHeader = this.setSubHeaderText(this.loggedInUser.branchId)
        }
      );
  }

  getAllEmployees() {
    this.ngxLoader.start()
    let params;
    params = {
      designationId: this.userSessionService.getDesignationId(),
      branchId: this.userSessionService.getBranchId()
    }
    this.userApiService.getEmployees(params)
      .subscribe((res) => {
        if (res.status) {
          this.usersArray = res.data;
        } else {
          this.toastrService.error(res.message);
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

  viewEmployee(user) {
    this.userSessionService.setUserToView(user);
    this.router.navigate(['/dashboard/users-profile']);
  }

  setSubHeaderText(branchId) {
    switch (branchId) {
      case 1: {
        return 'Corporate Office - Pune'
      }
      case 2: {
        return 'Kolkata Office'
      }
      case 3: {
        return 'Bengaluru Office'
      }
      case 4: {
        return 'Chennai Office'
      }
    }
  }

}
