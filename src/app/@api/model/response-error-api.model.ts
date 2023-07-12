export class ResponseErrorApi {

  constructor(
      public error?: string | null,
      public message?: string | null,
      public path?: string | null,
      public status?: number | null,
      public errors?: string[] | null,
      public timestamp?: number | null
  ) { }

}