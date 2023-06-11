import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AppEventService } from 'src/app/services/app.event.service';
import { UserSessionService } from 'src/app/services/user-session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('logoutModal', { static: false }) logoutModal: ElementRef;

  loggedInUser:any = {}
  private userResponse: Subscription;
  logoutModalObject: any = {};

  constructor(
    private userSessionService: UserSessionService,
    private appEventService: AppEventService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.userSessionService.loggedInUser;

    this.userResponse = this.appEventService.subscribe('loggedInUser')
      .subscribe(
        (res) => {
          this.loggedInUser = res;
        }
      );
  }

  ngOnDestroy() {
    this.userResponse.unsubscribe();
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
