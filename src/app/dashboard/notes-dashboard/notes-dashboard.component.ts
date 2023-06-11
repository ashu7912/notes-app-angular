import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import lo_ from 'lodash';
import { NotesApiService } from 'src/app/services/notes-api.service';
import { CoreApiTypes, NoteEventModel } from 'src/app/services/api-types';
import { UserApiService } from 'src/app/services/user-api.service';
import { forkJoin, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notes-dashboard',
  templateUrl: './notes-dashboard.component.html',
  styleUrls: ['./notes-dashboard.component.scss']
})
export class NotesDashboardComponent implements OnInit {
  @ViewChild('editNoteModal', { static: false }) editNoteModal: ElementRef;
  @ViewChild('confirmDelete', { static: false }) confirmDelete: ElementRef;
  @ViewChild('assignNoteModal', { static: false }) assignNoteModal: ElementRef;

  get title(): FormControl {
    return <FormControl>this.noteForm.get('title');
  }

  get description(): FormControl {
    return <FormControl>this.noteForm.get('description');
  }

  notesList: CoreApiTypes.NoteModel[] = [];
  otherUsers: CoreApiTypes.UserModel[] = [];
  otherUsersClone: CoreApiTypes.UserModel[] = [];
  loggedInUser: CoreApiTypes.UserModel;
  editNoteModalObject: any = {};
  confirmDeleteObject: any = {};
  assignNoteModalObject: any = {};
  editMode = false;
  noteSelectAll = false;

  noteForm: FormGroup
  selectedNote: CoreApiTypes.NoteModel;
  shared_users: number[];

  constructor(
    private notesApiService: NotesApiService,
    private userApiService: UserApiService,
    private ngxLoader: NgxUiLoaderService,
    private toastrService: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    this.loadUsersAndNotes();
    this.buildNoteForm();
  }


  buildNoteForm() {
    this.noteForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
  }

  public getUserAndTasks(): Observable<[CoreApiTypes.OtherUsersResponse, CoreApiTypes.AllNotesResponce]> {
    let response1 = this.userApiService.getOtherUsers()
    let response2 = this.notesApiService.getNotes();
    // ------------------------------------------------
    // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
    return forkJoin([response1, response2]);
  }

  loadUsersAndNotes() {
    this.ngxLoader.start()
    this.getUserAndTasks()
      .subscribe((res: [CoreApiTypes.OtherUsersResponse, CoreApiTypes.AllNotesResponce]) => {
        let response1 = res[0];
        let response2 = res[1];
        if (response1.status) {
          this.otherUsers = response1.data;
          this.otherUsersClone = lo_.cloneDeep(this.otherUsers);
        }
        if (response2.status) {
          this.notesList = response2.data;
        }
        this.mapNotesWithUsers();
      },
        (e) => {
          this.toastrService.error(e.error.message);
          this.ngxLoader.stop()
        },
        () => {
          this.ngxLoader.stop()
        },
      )
  }

  mapNotesWithUsers() {
    this.notesList.map((note: CoreApiTypes.NoteModel) => {
      if (note.owner_id == this.loggedInUser.user_id) {
        note['owner'] = `You`
      }
      this.otherUsers.map((user: CoreApiTypes.UserModel) => {
        if (note.owner_id == user.user_id) {
          note['owner'] = `${user.firstname} ${user.lastname}`
        }
      })
    })
  }


  // Note click Events -------------------------------
  noteEvent(event: NoteEventModel) {
    this.selectedNote = event.note;
    switch (event.eventType) {
      case 'assignNote': {
        this.shared_users = event.note.shared_users;
        this.setAlreadyAssignedUsers();
        this.openAssignNoteModal();
        break;
      }
      case 'deleteNote': {
        this.openConfirmDeleteModal();

        break;
      }
      case 'editNote': {
        this.editMode = true;
        this.buildNoteForm();
        this.title.patchValue(event.note.title);
        this.description.patchValue(event.note.description);
        this.openEditNote();
        break;
      }
      default:
        break;
    }
  }
  // Note click Events -------------------------------


  openEditNote() {
    this.editNoteModalObject = this.modalService.open(this.editNoteModal, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      backdropClass: 'ann-modal-backdrop modal-zindex',
      modalDialogClass: 'temp-modal',
    });
  }


  openConfirmDeleteModal() {
    this.confirmDeleteObject = this.modalService.open(this.confirmDelete, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      backdropClass: 'ann-modal-backdrop modal-zindex'
    });
  }

  openAssignNoteModal() {
    this.assignNoteModalObject = this.modalService.open(this.assignNoteModal, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      backdropClass: 'ann-modal-backdrop modal-zindex'
    });
  }

  saveUpdateNote() {
    if (!this.noteForm.valid) {
      return;
    }

    if (!this.editMode) {
      this.saveNote();
    } else {
      this.updateNote();
    }
  }

  addNote() {
    this.editMode = false;
    this.buildNoteForm();
    this.openEditNote();
  }

  saveNote() {
    this.ngxLoader.start();
    const params = {
      ...this.noteForm.value
    }
    this.notesApiService.saveNote(params)
      .subscribe((res: CoreApiTypes.SingleNoteResponse) => {
        if (res.status) {
          this.toastrService.success(res.message);
          this.loadUsersAndNotes();
        } else {
          this.toastrService.error(res.message)
        }
      },
        (e) => {
          this.toastrService.error(e.error.message);
          this.ngxLoader.stop();
          this.editNoteModalObject.close();
        },
        () => {
          this.ngxLoader.stop();
          this.editNoteModalObject.close()
        },
      )
  }

  updateNote() {
    this.ngxLoader.start();
    const params = {
      ...this.noteForm.value
    }
    this.notesApiService.updateNote(this.selectedNote.note_id, params)
      .subscribe((res: CoreApiTypes.SingleNoteResponse) => {
        if (res.status) {
          this.toastrService.success(res.message);
          this.loadUsersAndNotes();
        } else {
          this.toastrService.error(res.message)
        }
      },
        (e) => {
          this.toastrService.error(e.error.message);
          this.ngxLoader.stop();
          this.editNoteModalObject.close();
        },
        () => {
          this.ngxLoader.stop();
          this.editNoteModalObject.close()
        },
      )
  }

  deleteNote() {
    this.ngxLoader.start();
    this.notesApiService.deleteNote(this.selectedNote.note_id)
      .subscribe((res: CoreApiTypes.ResponceAny) => {
        if (res.status) {
          this.toastrService.success(res.message);
          this.loadUsersAndNotes();
        } else {
          this.toastrService.error(res.message)
        }
      },
        (e) => {
          this.toastrService.error(e.error.message);
          this.ngxLoader.stop();
          this.confirmDeleteObject.close();
        },
        () => {
          this.ngxLoader.stop();
          this.confirmDeleteObject.close()
        },
      )
  }

  checkUser(event, user: CoreApiTypes.UserModel) {
    user.isChecked = event.target.checked;
    if (user.isChecked) {
      this.shared_users.push(user.user_id);
    } else {
      this.shared_users.splice(this.shared_users.indexOf(user.user_id), 1);
    }
  }

  checkAllUsers(event) {
    (this.selectedNote.owner_id == this.loggedInUser.user_id) ? this.shared_users = [] : this.shared_users = [this.loggedInUser.user_id];
    this.otherUsers.map((user) => {
      user['isChecked'] = true;
      (event.target.checked) ? this.shared_users.push(user.user_id) : user['isChecked'] = false;
    })
  }

  setAlreadyAssignedUsers() {
    this.otherUsers = lo_.cloneDeep(this.otherUsersClone);

    this.otherUsers.map((user) => {
      user['isChecked'] = this.shared_users.includes(user.user_id)
    });
    const ownerIdIndex = this.otherUsers.findIndex((user) => user.user_id == this.selectedNote.owner_id)
    if (ownerIdIndex != -1) {
      this.otherUsers.splice(ownerIdIndex, 1)
    }
    this.noteSelectAll = this.otherUsers.every((user) => this.shared_users.includes(user.user_id));
  }


  assignNote() {
    this.ngxLoader.start();
    const params = {
      shared_users: this.shared_users
    }
    this.notesApiService.assignNote(this.selectedNote.note_id, params)
      .subscribe((res: CoreApiTypes.ResponceAny) => {
        if (res.status) {
          this.toastrService.success(res.message);
          this.loadUsersAndNotes();
        } else {
          this.toastrService.error(res.message)
        }
      },
        (e) => {
          this.toastrService.error(e.error.message);
          this.ngxLoader.stop();
          this.assignNoteModalObject.close();
        },
        () => {
          this.ngxLoader.stop();
          this.assignNoteModalObject.close()
        },
      )
  }
}
