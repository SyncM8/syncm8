import { Input, Col, Row, PageHeader, Tabs } from "antd";
import React, { FC, useState } from "react";
import { withRouter } from "react-router";
import { RouteComponentProps, Route, Switch, Redirect } from "react-router-dom";

import "./App.less";
import DashboardPage from "../Dashboard/DashboardPage";
import MatesPage from "../Mates/MatesPage";
import FamiliesPage from "../Families/FamiliesPages";
import LoginPage from "../Login/LoginPage";
import axios from "axios";

const { TabPane } = Tabs;

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

const App: FC<RouteComponentProps> = ({ history }) => {
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
      <PageHeader className="site-page-header">
        <Row>
          <Col span={8}>
            <Input.Search placeholder="sync with..." />
          </Col>
          <Col offset={8} span={4}>
            <Tabs
              onChange={(key) => {
                history.push(`/${key}`); // eslint-disable-line
              }}
              animated={{ inkBar: true, tabPane: false }}
            >
              <TabPane tab="Dashboard" key="" />
              <TabPane tab="Mates" key="mates" />
              <TabPane tab="Families" key="families" />
            </Tabs>
          </Col>
          <Col span={4}>Profile Here</Col>
        </Row>
      </PageHeader>
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
        <ProtectedRoute loggedIn={loggedIn} path="/">
          <DashboardPage />
        </ProtectedRoute>
      </Switch>
    </>
  );
};

export default withRouter(App);
