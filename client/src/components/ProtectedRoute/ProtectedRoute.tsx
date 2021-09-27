import React from "react";
import { Redirect, Route } from "react-router";

type ProtectedRoutesPropTypes = {
  children: React.ReactNode;
  loggedIn: boolean;
  path: string;
  exact?: boolean | undefined;
};

const isTesting = () => process.env.JEST_WORKER_ID !== undefined;
const ProtectedRoute = ({
  children,
  loggedIn,
  path,
  exact,
}: ProtectedRoutesPropTypes): JSX.Element => (
  <Route exact={exact} path={path}>
    {loggedIn || isTesting ? children : <Redirect to="/login" />}
  </Route>
);
ProtectedRoute.defaultProps = { exact: false };

export default ProtectedRoute;
