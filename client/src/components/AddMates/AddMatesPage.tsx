import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  Row,
  Space,
  Typography,
} from "antd";
import React, { FC, useState } from "react";
import { Prompt } from "react-router";

import { AddMateFormType, AddMateType } from "../types";
import AddMateCard from "./AddMateCard";

const { Title } = Typography;
const { Footer } = Layout;

const AddMatesPage: FC = () => {
  const [form] = Form.useForm<AddMateFormType>();
  const [mates, setMates] = useState<AddMateType[]>([]);

  const onAddMate = async ({ name, lastSeen }: AddMateFormType) => {
    setMates((prevArray) => [
      ...prevArray,
      { name, lastSynced: lastSeen.toDate(), ts: new Date().getTime() },
    ]);
    form.resetFields();
  };

  const removeMate = (mate: AddMateType) => {
    setMates((mateArr) =>
      mateArr.filter(
        (m8) =>
          !(
            m8.name === mate.name &&
            m8.lastSynced === mate.lastSynced &&
            m8.ts === mate.ts
          )
      )
    );
  };

  const cards = mates.map((mate) => (
    <Col span={6} key={mate.ts}>
      <AddMateCard mate={mate} removeMate={removeMate} />
    </Col>
  ));

  return (
    <>
      <Prompt
        when={mates.length > 0}
        message="Leaving will erase all your unsaved info. Are you sure?"
      />
      <Layout style={{ minHeight: "100vh" }}>
        <Row style={{ backgroundColor: "#F0F2F5", padding: "30px" }}>
          <Col>
            <Title>Populating M8s</Title>
          </Col>
        </Row>
        <Row style={{ padding: "30px" }}>
          <Col span={6}>
            <Title level={2}>Manual Entry</Title>
          </Col>

          <Col>
            <Form layout="inline" form={form} onFinish={onAddMate}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input autoFocus />
              </Form.Item>
              <Form.Item
                label="Last Seen"
                name="lastSeen"
                rules={[{ required: true }]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Mate
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <Divider />

        <Row style={{ padding: "10px 30px" }}>
          <Title level={2}>M8s</Title>
        </Row>
        <Row style={{ padding: "10px 30px" }} gutter={[24, 24]}>
          {cards}
        </Row>
        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Space>
            Once You’ve added all Your M8s (contacts) you can assign them to
            families
            <Button type="primary" disabled={mates.length === 0}>
              Assign M8s to Families
            </Button>
          </Space>
        </Footer>
      </Layout>
    </>
  );
};

export default AddMatesPage;
