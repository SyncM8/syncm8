import { Input, Col, Row, Button, PageHeader, Tabs, Typography } from "antd";
import React, { FC } from "react";
import { withRouter } from "react-router";
import { RouteComponentProps, Route, Switch } from "react-router-dom";

import "./App.less";
import DashboardPage from "./components/DashboardPage";
import MatesPage from "./components/MatesPage";
import FamiliesPage from "./components/FamiliesPages";

const { TabPane } = Tabs;
const { Title } = Typography;

const App: FC<RouteComponentProps> = ({ history }) => {
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
};

export default withRouter(App);
