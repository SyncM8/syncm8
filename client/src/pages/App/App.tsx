import "./App.less";

// import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

import { client, isLoggedInPath, IsLoggedInResponse } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import AssignMatesPage from "../AssignMates/AssignMatesPage";
import DashboardPage from "../Dashboard/DashboardPage";
import FamilyPage from "../Family/FamilyPage";
import Header from "../Header/Header";
import LoginPage from "../Login/LoginPage";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";
import RegisterPage from "../Register/RegisterPage";

/**
 * Logged In Status
 */
enum LoggedInStatus {
  LOGGED_IN = "LoggedIn",
  LOGGED_OUT = "LoggedOut",
  WAITING = "Waiting",
}

/**
 * Main App page
 * @returns JSX.Element
 */
const App = (): JSX.Element => {
  const [loggedInStatus, setLoggedInStatus] = useState(LoggedInStatus.LOGGED_OUT);

  // useEffect(() => {
  //   axios
  //     .get<IsLoggedInResponse>(isLoggedInPath)
  //     .then((res) => {
  //       const resStatus = res.data?.isLoggedIn
  //         ? LoggedInStatus.LOGGED_IN
  //         : LoggedInStatus.LOGGED_OUT;
  //       if (loggedInStatus !== resStatus) {
  //         setLoggedInStatus(resStatus);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setLoggedInStatus(LoggedInStatus.LOGGED_OUT);
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const setLoggedIn = (value: boolean) => {
  //   setLoggedInStatus(
  //     value ? LoggedInStatus.LOGGED_IN : LoggedInStatus.LOGGED_OUT
  //   );
  // };

  if (loggedInStatus === LoggedInStatus.WAITING) {
    return <LoadingSpinner />;
  }

  const loggedIn = client.authStore.model !== null;

  return (
    <>
      <Header logout={() => setLoggedInStatus(LoggedInStatus.LOGGED_OUT)} />
      <Switch>
        <Route path="/login">
          <LoginPage loggedIn={loggedIn} setLoggedIn={(success: boolean) => setLoggedInStatus(success ? LoggedInStatus.LOGGED_IN : LoggedInStatus.LOGGED_OUT)} />
        </Route>
        <Route path="/register">
          <RegisterPage setLoggedIn={(success: boolean) => setLoggedInStatus(success ? LoggedInStatus.LOGGED_IN : LoggedInStatus.LOGGED_OUT)} />
        </Route>
        <ProtectedRoute loggedIn={loggedIn} path="/mates">
          <MatesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/families">
          <FamilyPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/add-mates">
          <NewMatesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/assign-families">
          <AssignMatesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/" exact>
          <DashboardPage />
        </ProtectedRoute>
      </Switch>
    </>
  );
};

export default App;
