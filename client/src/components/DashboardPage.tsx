import { Typography } from "antd";
import React, { Component } from "react";

const { Title } = Typography;

export default class DashboardPage extends Component {
  render(): React.ReactNode {
    return (
      <>
        <Title>Dashboard!</Title>
      </>
    );
  }
}
