import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Row,
  Typography,
} from "antd";
import React, { FC, useState } from "react";

import { AddMateFormType, AddMateType } from "../types";
import AddMateCard from "./AddMateCard";

const { Title } = Typography;

const AddMatesPage: FC = () => {
  const [form] = Form.useForm();
  const [mates, setMates] = useState<AddMateType[]>([]);

  const onAddMate = ({ name, lastSeen }: AddMateFormType) => {
    const ts = new Date().getTime();
    setMates((prevArray) => [
      ...prevArray,
      { name, lastSynced: lastSeen.toDate(), ts },
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
      <Row>{cards}</Row>
    </>
  );
};

export default AddMatesPage;
