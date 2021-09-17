import React, { Component } from "react";
import { Typography, Button } from "antd";

const { Title } = Typography;

export default class DashboardPage extends Component {
  render(): React.ReactNode {
    return (
      <>
        <Title>Dashboard!</Title>
        <Title>{process.env.REACT_APP_GOOGLE_CLIENT_ID}</Title>
        <Button type="primary">Button Here</Button>
        <Title level={2}>Second Title</Title>
      </>
    );
  }
}
