import { Typography } from "antd";
import React from "react";

import App from "./App";

const { Title } = Typography;

const DashboardPage = (): JSX.Element => (
  <>
    <Title>Dashboard!</Title>
    <App />
  </>
);

export default DashboardPage;
