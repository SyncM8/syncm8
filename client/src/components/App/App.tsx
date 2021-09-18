import "./App.less";

import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import DashboardPage from "../Dashboard/DashboardPage";
import FamiliesPage from "../Families/FamiliesPages";
import Header from "../Header/Header";
import MatesPage from "../Mates/MatesPage";
import NewMatesPage from "../NewMates/NewMatesPage";

const App: FC = () => (
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
      <Route path="/">
        <DashboardPage />
      </Route>
    </Switch>
  </>
);

export default App;
