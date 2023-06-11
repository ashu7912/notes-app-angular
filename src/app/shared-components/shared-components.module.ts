import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleNoteComponent } from './single-note/single-note.component';
import { UsersListComponent } from './users-list/users-list.component';



@NgModule({
  declarations: [
    SingleNoteComponent,
    UsersListComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SingleNoteComponent,
    UsersListComponent
  ]
})
export class SharedComponentsModule { }
