import React, { Component } from "react";
import { Typography } from "antd";

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
