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
import axios from "axios";
import React from "react";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";

import { logoutPath } from "../../api";

const { TabPane } = Tabs;

type HeaderPageProps = {
  logoutApp: () => void;
};

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

const HeaderPage = ({ logoutApp }: HeaderPageProps): JSX.Element => {
  const history = useHistory();
  const location = useLocation();

  /**
   * Logs out user from app
   */
  const logoutHandler = (): void => {
    axios
      .post(logoutPath)
      .catch((err) => {
        console.error(err);
      })
      .finally(() => logoutApp());
  };

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
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logoutHandler}>
        Log Out
      </Menu.Item>
    </Menu>
  );

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

export default HeaderPage;
