export namespace CoreApiTypes{
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
}