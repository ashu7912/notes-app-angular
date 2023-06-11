import { Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import { CoreApiTypes, NoteEventModel } from 'src/app/services/api-types';

@Component({
  selector: 'app-single-note',
  templateUrl: './single-note.component.html',
  styleUrls: ['./single-note.component.scss']
})
export class SingleNoteComponent implements OnInit {

  @Input() singleNote: CoreApiTypes.NoteModel;
  @Output() noteEvent:EventEmitter<NoteEventModel> = new EventEmitter<NoteEventModel>();

  constructor() { }

  ngOnInit(): void {
    
  }

  assignNote() {
    this.noteEvent.emit({
      eventType:'assignNote',
      note: this.singleNote
    });
  }

  deleteNote() {
    this.noteEvent.emit({
      eventType:'deleteNote',
      note: this.singleNote
    });
  }

  editNote() {
    this.noteEvent.emit({
      eventType:'editNote',
      note: this.singleNote
    });
  }

}
