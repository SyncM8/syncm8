import PocketBase from "pocketbase/dist/pocketbase.cjs";

const apiPath = process.env.REACT_APP_API_URL ?? "";
type ErrorResponse =
  | { status_code: number; error_details: string }
  | { [index: string]: never };

export const loginPath = `${apiPath}/login`;
export interface LoginResponse {
  isLoggedIn: boolean;
  error: ErrorResponse;
}

export const isLoggedInPath = `${apiPath}/isLoggedIn`;
export interface IsLoggedInResponse {
  isLoggedIn: boolean;
}

export const graphqlPath = `${apiPath}/graphql`;

export const logoutPath = `${apiPath}/logout`;

const url = "http://127.0.0.1:8090";
export const client = new PocketBase(url);
