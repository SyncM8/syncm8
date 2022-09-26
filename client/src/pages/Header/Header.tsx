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
  Image,
  Input,
  Menu,
  PageHeader,
  Row,
} from "antd";
import axios from "axios";
import React from "react";
import { useHistory } from "react-router";
import { Link, useLocation } from "react-router-dom";

import { client, logoutPath } from "../../api";

type HeaderPageProps = {
  logout: () => void;
};

const HeaderPage = ({logout}: HeaderPageProps): JSX.Element => {
  const history = useHistory();
  const location = useLocation();

  /**
   * Logs out user from app
   */
  const logoutHandler = (): void => {
    // axios
    //   .post(logoutPath)
    //   .catch((err) => {
    //     console.error(err);
    //   })
    //   .finally(() => logoutApp());
    client.authStore.clear();
    logout();
    history.push("/");
  };

  const menu = client.authStore.model !== null ? (
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
  ) : <></>;

  return (
    <>
      <PageHeader>
        <Row align="middle">
          <Col span={1}>
            <Link to="/">
              <Image
                src="/logo190.png"
                alt="syncm8_logo"
                width="60"
                preview={false}
              />
            </Link>
          </Col>
          <Col span={8}>
            <Input.Search
              placeholder="sync with..."
              aria-label="search-input"
            />
          </Col>
          <Col offset={8} span={6}>
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              onClick={(e) => {
                history.push(e.key);
              }}
              style={{ background: "transparent" }}
            >
              <Menu.Item key="/" icon={<DashboardOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="/families" icon={<TeamOutlined />}>
                Families
              </Menu.Item>
              <Menu.Item key="/mates" icon={<ContactsOutlined />}>
                Mates
              </Menu.Item>
            </Menu>
          </Col>
          <Col span={1} style={{ textAlign: "right" }}>
            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar size="large" icon={<UserOutlined />} />
            </Dropdown>
          </Col>
        </Row>
      </PageHeader>
    </>
  );
};

export default HeaderPage;
