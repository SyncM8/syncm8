import React from "react";
import { Typography, Button, notification } from "antd";
import { Redirect } from "react-router-dom";
import * as queryString from "query-string";
import axios from "axios";
const { Title } = Typography;

type LoginPageProps = {
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void;
};

export default function LoginPage({
  loggedIn,
  setLoggedIn,
}: LoginPageProps): JSX.Element {
  function openNotification(errorMessage: string) {
    notification.open({
      message: "Login error",
      description: errorMessage,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  }

  function doLogin() {
    const options = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
      redirect_uri: (process.env.REACT_APP_HOST_URL ?? "") + "/login",
      response_type: "token",
      include_granted_scopes: "true",
      scope: "openid",
    };

    window.location.href =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      queryString.stringify(options);
  }

  function checkloginCallback() {
    const parsedParams = queryString.parse(window.location.hash);
    window.location.hash = "";

    if ("error" in parsedParams) {
      openNotification(String(parsedParams["error"]));
    } else if ("access_token" in parsedParams) {
      console.log(parsedParams);
      axios
        .post((process.env.REACT_APP_API_URL ?? "") + "/login", parsedParams)
        .then(() => setLoggedIn(true))
        .catch((err) => openNotification(String(err)));
    }
  }

  checkloginCallback();

  // Redirect if authentication is done:
  if (loggedIn) return <Redirect to="/" />;
  else
    return (
      <>
        <Title>Login</Title>
        <Button type="primary" onClick={doLogin}>
          Login with Google
        </Button>
      </>
    );
}
