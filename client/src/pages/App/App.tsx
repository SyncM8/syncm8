import "./App.less";

import React from "react";
import { Route, Switch } from "react-router-dom";

import AssignMatesPage from "../AssignMates/AssignMatesPage";
import DashboardPage from "../Dashboard/DashboardPage";
import FamiliesPage from "../Families/FamiliesPages";
import Header from "../Header/Header";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";

const App = (): JSX.Element => (
  <>
    <Header />
    <Switch>
      <Route path="/mates">
        <MatesPage />
      </Route>
      <Route path="/families">
        <FamiliesPage />
      </Route>
      <Route path="/add-mates">
        <NewMatesPage />
      </Route>
      <Route path="/assign-families">
        <AssignMatesPage />
      </Route>
      <Route path="/" exact>
        <DashboardPage />
      </Route>
    </Switch>
  </>
);

export default App;
