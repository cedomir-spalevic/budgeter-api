export interface ConfirmationResponse {
   key: string;
}

export interface AuthResponse {
   token: string;
}

export interface GetResponse<T> {
   count: number;
   values: T[];
}