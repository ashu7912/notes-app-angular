export namespace CoreApiTypes {
  export interface ResponceAny {
    status: boolean,
    message: string,
    data: any
  }
  export interface Login {
    email: string;
    password: string;
  }
  export interface GetAllEmployees {
    designationId: Number;
    branchId: Number;
  }

  export interface UserWithToken extends ResponceAny {
    token: string;
    data: UserModel;
  }
  export interface OtherUsersResponse extends ResponceAny {
    data: UserModel[]
  }

  export interface UserModel {
    user_id: number,
    firstname: string,
    lastname: string,
    email: string,
    dob: any,
    isChecked?: boolean
  }

  export interface AllNotesResponce extends ResponceAny {
    data: NoteModel[]
  }

  export interface SingleNoteResponse extends ResponceAny {
    data: NoteModel
  }

  export interface NoteModel {
    note_id: number,
    owner_id: number,
    title: string,
    description: string,
    shared_users: number[],
    owner?: string,
  }
}

export interface NoteEventModel {
  eventType: string,
  note: CoreApiTypes.NoteModel
}

export interface NoteSaveModel{
  title: string
  description: string
}

export interface AssignNoteModal{
  shared_users: number[]
}