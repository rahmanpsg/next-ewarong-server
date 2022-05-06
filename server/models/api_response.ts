export interface IApiResponse {
  message?: string | null;
  error: boolean;
  errors?: Map<string, string> | null;
  data?: any;
}

export default class ApiResponse implements IApiResponse {
  message?: string | null;
  error: boolean;
  errors?: Map<string, string> | null;
  data?: any;
  constructor({ message, error, errors, data }: IApiResponse) {
    this.message = message;
    this.error = error;
    this.errors = errors;
    this.data = data;
  }
}
