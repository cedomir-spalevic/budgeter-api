export interface Token {
   issuedAt: number;
   userId: string;
   refreshToken: string;
}

export enum UserClaims {
   Admin,
   Service,
}
