import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CoreApiTypes } from 'src/app/services/api-types';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('logoutModal', { static: false }) logoutModal: ElementRef;

  loggedInUser:CoreApiTypes.UserModel;
  
  logoutModalObject: any = {};

  constructor(
    private userSessionService: UserSessionService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
  }

  ngOnDestroy() {
    
  }

  openlogout() {
    this.logoutModalObject = this.modalService.open(this.logoutModal, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      backdropClass: 'ann-modal-backdrop modal-zindex'
    });
  }

  logout() {
    this.userSessionService.logout();
    this.logoutModalObject.close();
  }

}
