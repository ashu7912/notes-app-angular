import { Injectable } from '@angular/core';
import { CoreApiTypes, NoteSaveModel, AssignNoteModal } from './api-types';
import { ResourceService } from './resource.service';
import { ApiEndpoints, ExtendedEndpoints } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class NotesApiService {

  constructor(
    private resourceService: ResourceService<any>
    ) { }

  getNotes() {
    return this.resourceService.get(ApiEndpoints.notes)
  }

  saveNote(params : NoteSaveModel) {
    return this.resourceService.post(ApiEndpoints.notes, params)
  }
  
  updateNote(noteId, params : NoteSaveModel) {
    return this.resourceService.post(ApiEndpoints.notes+ExtendedEndpoints.update+`/${noteId}`, params)
  }

  deleteNote(noteId) {
    return this.resourceService.delete(ApiEndpoints.notes+ExtendedEndpoints.delete+`/${noteId}`)
  }
  
  assignNote(noteId, params: AssignNoteModal) {
    return this.resourceService.post(ApiEndpoints.notes+ExtendedEndpoints.assign+`/${noteId}`, params)
  }
}
