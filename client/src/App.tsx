import React, { FC } from "react";
import "./App.css";

import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const App: FC = () => (
  <>
    <Layout>
      <Header>Header</Header>
      <Layout>
        <Content>Content</Content>
        <Sider>Sider</Sider>
      </Layout>
      <Footer>Footer</Footer>
    </Layout>
  </>
);

export default App;
