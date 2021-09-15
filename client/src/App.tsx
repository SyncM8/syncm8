import React, { FC } from "react";
import "./App.less";

import { Input, Col, Row, Button, PageHeader, Tabs, Typography } from "antd";

const { Title } = Typography;
const { TabPane } = Tabs;

const App: FC = () => (
  <>
    <PageHeader
      className="site-page-header"
      // title="Title"
      // subTitle="This is a subtitle"
    >
      <Row>
        <Col span={8}>
          <Input.Search placeholder="sync with..." />
        </Col>
        <Col offset={8} span={4}>
          <Tabs defaultActiveKey="dashboard">
            <TabPane tab="Dashboard" key="dashboard" />
            <TabPane tab="Mates" key="mates" />
            <TabPane tab="Families" key="families" />
          </Tabs>
        </Col>
        <Col span={4}>Profile Here</Col>
      </Row>
    </PageHeader>
    <Title>Title</Title>
    <Button type="primary">Button Here</Button>
    <Title level={2}>Second Title</Title>
  </>
);

export default App;
