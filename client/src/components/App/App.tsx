import React, { useState } from "react";
import { withRouter } from "react-router";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.less";
import DashboardPage from "../Dashboard/DashboardPage";
import FamiliesPage from "../Families/FamiliesPages";
import Header from "../Header/Header";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";
import LoginPage from "../Login/LoginPage";
import axios from "axios";

type ProtectedRoutesPropTypes = {
  children: React.ReactNode;
  loggedIn: boolean;
  path: string;
};

const ProtectedRoute = ({
  children,
  loggedIn,
  path,
}: ProtectedRoutesPropTypes) => {
  return (
    <Route path={path}>{loggedIn ? children : <Redirect to="/login" />}</Route>
  );
};

const apiPath = process.env.REACT_APP_API_URL ?? "";

const App = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);
  function checkLoggedIn() {
    axios
      .get(apiPath + "/isLoggedIn")
      .then((res) => {
        console.log(res.data);
        // let resLoggedIn = false;
        // if ('isLoggedIn' in res.data) {
        //   resLoggedIn = res.data['isLoggedIn']; // eslint-disable-line
        // }
        // setLoggedIn(resLoggedIn);
      })
      .catch((err) => console.log(err));
  }
  checkLoggedIn();

  return (
    <>
      <Header />
      <Switch>
        <Route path="/login">
          <LoginPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        </Route>
        <ProtectedRoute loggedIn={loggedIn} path="/mates">
          <MatesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/add-mates">
          <NewMatesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/families">
          <FamiliesPage />
        </ProtectedRoute>
        <ProtectedRoute loggedIn={loggedIn} path="/">
          <DashboardPage />
        </ProtectedRoute>
      </Switch>
    </>
  );
};

export default withRouter(App);
