export const EMAIL_USER_IDENTIFIER_TYPE = "EMAIL";
export const PHONE_USER_IDENTIFIER_TYPE = "PHONE";

export const AUTH_ENDPOINT = "auth";
export const CHALLENGE_ENDPOINT = "challenge";
export const CONFIRM_ENDPOINT = "confirm";
export const REFRESH_ENDPOINT = "refresh";

export const CHALLENGE_PATH = `/${AUTH_ENDPOINT}/${CHALLENGE_ENDPOINT}`;
export const CONFIRM_PATH = `/${AUTH_ENDPOINT}/${CONFIRM_ENDPOINT}`;
export const REFRESH_PATH = `/${AUTH_ENDPOINT}/${REFRESH_ENDPOINT}`;