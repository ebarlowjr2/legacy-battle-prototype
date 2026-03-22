/** Standard API envelope (success). */
export interface ApiSuccess<T> {
  success: true;
  data: T;
}

/** Standard API envelope (failure). */
export interface ApiErrorBody {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
}

export interface ApiError {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
