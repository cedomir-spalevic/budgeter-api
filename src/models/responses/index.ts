export interface ConfirmationResponse {
   expires: number;
   key: string;
}

export interface AuthResponse {
   accessToken: string;
   refreshToken: string;
   expires: number;
}

export interface GetResponse<T> {
   count: number;
   values: T[];
}