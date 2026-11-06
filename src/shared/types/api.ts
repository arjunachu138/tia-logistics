export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      data?: {
        Response?: {
          Description?: string;
        };
      };
    };
  };
  message?: string;
}
