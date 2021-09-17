import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Col,
  Dropdown,
  Input,
  Menu,
  PageHeader,
  Row,
  Tabs,
} from "antd";
import React, { FC } from "react";
import { withRouter } from "react-router";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";

const { TabPane } = Tabs;

const menu = (
  <Menu>
    <Menu.Item key="add-mates">
      <Link to="/add-mates">Add Mates</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="settings">
      <Link to="/settings">Setting</Link>
    </Menu.Item>
  </Menu>
);

const PageHeaderPage: FC<RouteComponentProps> = ({ history }) => {
  const location = useLocation();
  return (
    <>
      <PageHeader className="site-page-header">
        <Row>
          <Col span={8}>
            <Input.Search placeholder="sync with..." />
          </Col>
          <Col offset={8} span={4}>
            <Tabs
              activeKey={location.pathname}
              onChange={(key) => {
                history.push(key);
              }}
              animated={{ inkBar: true, tabPane: false }}
            >
              <TabPane tab="Dashboard" key="/" />
              <TabPane tab="Mates" key="/mates" />
              <TabPane tab="Families" key="/families" />
            </Tabs>
          </Col>
          <Col span={4}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </Col>
        </Row>
      </PageHeader>
    </>
  );
};

export default withRouter(PageHeaderPage);
