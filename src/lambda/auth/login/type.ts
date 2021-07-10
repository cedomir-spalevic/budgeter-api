import { AuthResponse, ConfirmationResponse } from "models/responses";

export interface LoginRequest {
   email?: string;
   phoneNumber?: string;
   password: string;
}

export interface LoginResponse {
   status: number;
   response: AuthResponse | ConfirmationResponse;
}
