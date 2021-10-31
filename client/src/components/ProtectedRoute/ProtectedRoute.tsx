import React from "react";
import { Redirect, Route, useLocation } from "react-router";

import { LocationState } from "../../pages/types";

type ProtectedRoutesPropTypes = {
  children: React.ReactNode;
  loggedIn: boolean;
  path: string;
  exact?: boolean | undefined;
};

const ProtectedRoute = ({
  children,
  loggedIn,
  path,
  exact,
}: ProtectedRoutesPropTypes): JSX.Element => {
  const location = useLocation<LocationState>();
  return (
    <Route exact={exact} path={path}>
      {loggedIn ? (
        children
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { prevPath: location.pathname } }}
        />
      )}
    </Route>
  );
};
ProtectedRoute.defaultProps = { exact: false };

export default ProtectedRoute;
