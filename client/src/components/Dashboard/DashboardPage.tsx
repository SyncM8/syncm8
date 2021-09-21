import { Button, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const DashboardPage = (): JSX.Element => (
  <>
    <Title>Dashboard!</Title>
    <Title>{process.env.REACT_APP_GOOGLE_CLIENT_ID}</Title>
    <Button type="primary">Button Here</Button>
    <Title level={2}>Second Title</Title>
  </>
);
export default DashboardPage;
