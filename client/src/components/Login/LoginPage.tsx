import { Button, notification, Typography } from "antd";
import axios from "axios";
import { parse, stringify } from "querystring";
import React from "react";
import { Redirect } from "react-router-dom";

import { loginPath, LoginResponse } from "../../api";
// // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
// const axios = require('axios').default;

const { Title } = Typography;

type LoginPageProps = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

const LoginPage = ({ loggedIn, setLoggedIn }: LoginPageProps): JSX.Element => {
  function openNotification(errorMessage: string) {
    notification.open({
      message: "Login error",
      description: errorMessage,
    });
  }

  const doLogin = () => {
    const options = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
      redirect_uri: `${process.env.REACT_APP_HOST_URL ?? ""}/login`,
      response_type: "token",
      include_granted_scopes: "true",
      scope: "openid",
    };

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${stringify(
      options
    )}`;
  };

  function checkloginCallback() {
    const parsedParams = parse(window.location.hash);
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
  }

  checkloginCallback();

  // Redirect if authentication is done:
  if (loggedIn) return <Redirect to="/" />;
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
