import { Button, notification, Typography } from "antd";
import axios from "axios";
import { parse, stringify } from "querystring";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { loginPath, LoginResponse } from "../../api";
import { LocationState } from "../types";

const { Title } = Typography;

type LoginPageProps = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

const openNotification = (errorMessage: string) => {
  notification.open({
    message: "Login error",
    description: errorMessage,
  });
};

const doLogin = () => {
  const options = {
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
    redirect_uri: `${process.env.REACT_APP_HOST_URL ?? ""}/login`,
    response_type: "token",
    include_granted_scopes: "true",
    scope: "openid email profile",
  };

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${stringify(
    options
  )}`;
};

const LoginPage = ({
  loggedIn,
  setLoggedIn,
}: LoginPageProps): JSX.Element | null => {
  const history = useHistory();
  const location = useLocation<LocationState>();

  const checkloginCallback = () => {
    // window.location.hash keeps the hash, part so we chop it off with substr
    const parsedParams = parse(window.location.hash.substr(1));
    window.location.hash = "";
    if ("error" in parsedParams) {
      openNotification(String(parsedParams.error));
    } else if ("access_token" in parsedParams) {
      axios
        .post<LoginResponse>(loginPath, parsedParams)
        .then((res) => {
          if (res.data.isLoggedIn) {
            setLoggedIn(true);
          } else {
            openNotification(JSON.stringify(res.data.error));
          }
        })
        .catch((err) => openNotification(String(err)));
    }
  };

  checkloginCallback();

  // Redirect if authentication is done
  if (loggedIn) {
    const prevPath = location.state?.prevPath ?? "/";
    history.replace(prevPath);
    return null;
  }
  return (
    <>
      <Title>Login</Title>
      <Button type="primary" onClick={doLogin}>
        Login with Google
      </Button>
    </>
  );
};
export default LoginPage;
