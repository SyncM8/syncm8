import { Button, notification, Typography } from "antd";
import axios from "axios";
import { parse, stringify } from "querystring";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";

import { loginPath, LoginResponse } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { LocationState } from "../types";

const { Title } = Typography;

const PREV_PATH_KEY = "prevPath";

type LoginPageProps = {
  loggedIn: boolean;
  beforeLoginPath: string;
  setLoggedIn: (value: boolean) => void;
  setBeforeLoginPath: (prevPath: string) => void;
};

const openNotification = (errorMessage: string) => {
  notification.open({
    message: "Login error",
    description: errorMessage,
  });
};

/**
 * Authorize with Google's oAuth
 * @param prevPath to remember after login
 */
const doLogin = (prevPath = "/") => {
  const state = stringify({
    [PREV_PATH_KEY]: prevPath,
  });

  const options = {
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "",
    redirect_uri: `${process.env.REACT_APP_HOST_URL ?? ""}/login`,
    response_type: "token",
    include_granted_scopes: "true",
    scope: "openid email profile",
    state,
  };

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${stringify(
    options
  )}`;
};

/**
 * Login Page
 * @param logingPageProps App's states
 * @returns JSX.Element
 */
const LoginPage = ({
  loggedIn,
  setLoggedIn,
  beforeLoginPath,
  setBeforeLoginPath,
}: LoginPageProps): JSX.Element => {
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

    const { state } = parsedParams;
    if (typeof state === "string" && state.includes(PREV_PATH_KEY)) {
      const newPrevPath = parse(state)[PREV_PATH_KEY];
      if (typeof newPrevPath === "string") {
        setBeforeLoginPath(newPrevPath);
      }
    }
  };

  checkloginCallback();

  // Redirect if authentication is done
  if (loggedIn) {
    const replacePath = location.state?.prevPath ?? beforeLoginPath;
    history.replace(replacePath);
    return <LoadingSpinner />;
  }
  return (
    <>
      <Title>Login</Title>
      <Button type="primary" onClick={() => doLogin(location.state?.prevPath)}>
        Login with Google
      </Button>
    </>
  );
};
export default LoginPage;
