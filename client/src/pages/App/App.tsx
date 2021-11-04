import "./App.less";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

import { isLoggedInPath, IsLoggedInResponse } from "../../api";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import AssignMatesPage from "../AssignMates/AssignMatesPage";
import DashboardPage from "../Dashboard/DashboardPage";
import FamiliesPage from "../Families/FamiliesPages";
import Header from "../Header/Header";
import LoginPage from "../Login/LoginPage";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";

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
  const [loggedInStatus, setLoggedInStatus] = useState(LoggedInStatus.WAITING);
  const [beforeLoginPath, setBeforeLoginPath] = useState("/");

  useEffect(() => {
    axios
      .get<IsLoggedInResponse>(isLoggedInPath)
      .then((res) => {
        const resStatus = res.data?.isLoggedIn
          ? LoggedInStatus.LOGGED_IN
          : LoggedInStatus.LOGGED_OUT;
        if (loggedInStatus !== resStatus) {
          setLoggedInStatus(resStatus);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoggedInStatus(LoggedInStatus.LOGGED_OUT);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLoggedIn = (value: boolean) => {
    setLoggedInStatus(
      value ? LoggedInStatus.LOGGED_IN : LoggedInStatus.LOGGED_OUT
    );
  };

  if (loggedInStatus === LoggedInStatus.WAITING) {
    return <LoadingSpinner />;
  }
  const loggedIn = loggedInStatus === LoggedInStatus.LOGGED_IN;
  return (
    <>
      <Header />
      <Switch>
        <Route path="/login">
          <LoginPage
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
            beforeLoginPath={beforeLoginPath}
            setBeforeLoginPath={setBeforeLoginPath}
          />
        </Route>
        <ProtectedRoute loggedIn={loggedIn} path="/mates">
          <MatesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/families">
          <FamiliesPage />
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
