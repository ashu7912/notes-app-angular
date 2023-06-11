import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import lo_ from 'lodash';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppEventService } from 'src/app/services/app.event.service';
import { UserSessionService } from 'src/app/services/user-session.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @ViewChild('editProfileRef', { static: false }) editProfileRef: ElementRef;

  profileInfo: any = {}
  profileInfoEdit: any = {}
  loggedInUser: any = {}
  errorMessage = ''
  private userResponse: Subscription;
  editProfileObj: any = {};
  emailPattern = /^([0-9a-zA-Z]([-\.\w]*[0-9a-zA-Z+])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  cellPattern = /^[0-9]*$/;


  constructor(
    private userSessionService: UserSessionService,
    private appEventService: AppEventService,
    private router: Router,
    private modalService: NgbModal,
    private userApiService: UserApiService,
    private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.userSessionService.loggedInUser;
    this.userResponse = this.appEventService.subscribe('loggedInUser')
      .subscribe(
        (res) => {
          this.loggedInUser = res;
          this.profileInfo = this.loggedInUser;
        }
      );

    if (this.userSessionService.getDesignationId() == 4) {
      this.profileInfo = this.loggedInUser;
    }

    if (this.userSessionService.getDesignationId() != 4) {
      if (lo_.isEmpty(this.userSessionService.getUserToView())) {
        this.router.navigate(['/dashboard/users-list']);
      } else {
        this.profileInfo = this.userSessionService.getUserToView()
      }
    }
  }


  openEditModal() {
    this.profileInfoEdit.joiningDate = ''
    this.profileInfoEdit = lo_.clone(this.profileInfo)
    this.editProfileObj = this.modalService.open(this.editProfileRef, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-w-650',
      backdropClass: 'ann-modal-backdrop modal-zindex'
    });
  }

  changeInput(event: any) {
    this.errorMessage = '';
  }

  backToList() {
    this.router.navigate(['/dashboard/users-list']);
  }

  signUp() {
    let updatedProfile;
    updatedProfile = lo_.cloneDeep(this.profileInfoEdit)
    delete updatedProfile.createdAt
    delete updatedProfile.updatedAt
    delete updatedProfile.history
    delete updatedProfile.promotions
    delete updatedProfile.__v
    updatedProfile.branchId = +updatedProfile.branchId
    updatedProfile.designationId = +updatedProfile.designationId
    updatedProfile.branchName = this.setBranchName(updatedProfile.branchId)
    updatedProfile.designation = this.setDesignation(updatedProfile.designationId)
    updatedProfile.mobile = updatedProfile.mobile.replace(/[-() ]/g, '');

    this.ngxLoader.start()
    this.userApiService.updateUser(updatedProfile)
    .subscribe((res) => {
      if(res.status) {
        this.toastrService.success(res.message);
        this.profileInfo = Object.assign(this.profileInfo, updatedProfile);
        this.editProfileObj.close()
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

  setBranchName(branchId) {
    switch (branchId) {
      case 1: {
        return 'Pune'
      }
      case 2: {
        return 'Kolkata'
      }
      case 3: {
        return 'Bengaluru'
      }
      case 4: {
        return 'Chennai'
      }
    }
  }
  setDesignation(designation) {
    switch (designation) {
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
}
