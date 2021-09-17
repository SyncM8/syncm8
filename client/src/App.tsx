import "./App.less";

import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import AddMatesPage from "./components/AddMatesPage";
import DashboardPage from "./components/DashboardPage";
import FamiliesPage from "./components/FamiliesPages";
import MatesPage from "./components/MatesPage";
import PageHeader from "./components/PageHeader";

const App: FC = () => (
  <>
    <PageHeader />
    <Switch>
      <Route path="/mates">
        <MatesPage />
      </Route>
      <Route path="/families">
        <FamiliesPage />
      </Route>
      <Route path="/add-mates">
        <AddMatesPage />
      </Route>
      <Route path="/">
        <DashboardPage />
      </Route>
    </Switch>
  </>
);

export default App;
