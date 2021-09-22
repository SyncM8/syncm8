import {
  ContactsOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
import React from "react";
import { withRouter } from "react-router";
import { Link, RouteComponentProps, useLocation } from "react-router-dom";

const { TabPane } = Tabs;

const menu = (
  <Menu>
    <Menu.Item key="add-mates">
      <Link to="/add-mates">Add Mates</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="assign-families">
      <Link to="/assign-families">Assign Families</Link>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="settings">
      <Link to="/settings">Setting</Link>
    </Menu.Item>
  </Menu>
);

const dashboardTab = (
  <>
    <DashboardOutlined />
    Dashboard
  </>
);

const matesTab = (
  <>
    <ContactsOutlined />
    Mates
  </>
);

const familiesTab = (
  <>
    <TeamOutlined />
    Families
  </>
);

const HeaderPage = ({ history }: RouteComponentProps): JSX.Element => {
  const location = useLocation();
  return (
    <>
      <PageHeader>
        <Row>
          <Col span={8}>
            <Input.Search
              placeholder="sync with..."
              aria-label="search-input"
            />
          </Col>
          <Col offset={6} span={6}>
            <Tabs
              activeKey={location.pathname}
              onChange={(key) => {
                history.push(key);
              }}
              animated={{ inkBar: true, tabPane: false }}
            >
              <TabPane tab={dashboardTab} key="/" />
              <TabPane tab={matesTab} key="/mates" />
              <TabPane tab={familiesTab} key="/families" />
            </Tabs>
          </Col>
          <Col span={4}>
            <Dropdown overlay={menu} trigger={["click", "hover"]}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </Col>
        </Row>
      </PageHeader>
    </>
  );
};

export default withRouter(HeaderPage);
