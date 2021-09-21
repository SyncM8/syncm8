import "./App.less";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import DashboardPage from "../Dashboard/DashboardPage";
import FamiliesPage from "../Families/FamiliesPages";
import Header from "../Header/Header";
import LoginPage from "../Login/LoginPage";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";

type ProtectedRoutesPropTypes = {
  children: React.ReactNode;
  loggedIn: boolean;
  path: string;
};

const ProtectedRoute = ({
  children,
  loggedIn,
  path,
}: ProtectedRoutesPropTypes) => (
  <Route path={path}>{loggedIn ? children : <Redirect to="/login" />}</Route>
);

const apiPath = process.env.REACT_APP_API_URL ?? "";

const App = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get(`${apiPath}/isLoggedIn`)
      .then((res) => {
        console.log(res.data);
        let resLoggedIn = false;
        if ("isLoggedIn" in res.data) {
          resLoggedIn = res.data.isLoggedIn; //  eslint-disable-line
        }
        if (loggedIn !== resLoggedIn) {
          setLoggedIn(resLoggedIn);
        }
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

export default App;
