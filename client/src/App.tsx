import "./App.less";

import { Button, Typography } from "antd";
import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";

import DashboardPage from "./components/DashboardPage";
import FamiliesPage from "./components/FamiliesPages";
import MatesPage from "./components/MatesPage";
import PageHeader from "./components/PageHeader";

const { Title } = Typography;

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
      <Route path="/">
        <DashboardPage />
      </Route>
    </Switch>
    <Title>Title</Title>
    <Button type="primary">Button Here</Button>
    <Title level={2}>Second Title</Title>
  </>
);

export default App;
