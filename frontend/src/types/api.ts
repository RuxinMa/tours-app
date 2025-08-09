export interface ApiResponse<T> {
  success: "success" | "fail" | "error";
  results?: number;
  data: T;
  message?: string;
}

export interface ApiError {
  status: string;
  message: string;
  code?: string;
}