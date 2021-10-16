import "./App.less";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

import { isLoggedInPath, IsLoggedInResponse } from "../../api";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import AssignMatesPage from "../AssignMates/AssignMatesPage";
import DashboardPage from "../Dashboard/DashboardPage";
import FamiliesPage from "../Families/FamiliesPages";
import Header from "../Header/Header";
import LoginPage from "../Login/LoginPage";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";

const App = (): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    axios
      .get<IsLoggedInResponse>(isLoggedInPath)
      .then((res) => {
        let resLoggedIn = false;
        if ("isLoggedIn" in res.data) {
          resLoggedIn = res.data.isLoggedIn;
        }
        if (loggedIn !== resLoggedIn) {
          setLoggedIn(resLoggedIn);
        }
      })
      .catch((err) => console.error(err));
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
