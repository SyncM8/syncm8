import { Typography } from "antd";
import React from "react";

import AssignMatesPage from "../AssignMates/AssignMatesPage";

const { Title } = Typography;

const DashboardPage = (): JSX.Element => (
  <>
    <Title>Dashboard!</Title>
    <AssignMatesPage />
  </>
);

export default DashboardPage;
