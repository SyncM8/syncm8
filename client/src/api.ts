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
