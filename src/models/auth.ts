export interface Token {
   issuedAt: number;
   userId: string;
}

export interface Device {
   userId: string;
   device: string;
   platformEndpoint: string;
}