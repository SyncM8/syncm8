import { useMutation } from "@apollo/client";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  notification,
  Row,
  Typography,
} from "antd";
import React, { useState } from "react";
import { Prompt } from "react-router";

import NewMatesCard from "../../components/NewMateCard/NewMateCard";
import { ADD_NEW_MATES, AddNewMatesReturn } from "../../graphql/graphql";
import { NewMatesInput } from "../../graphql/types";
import { NewMatesFormType, NewMateType } from "../types";

const { Title } = Typography;
const { Footer } = Layout;

/**
 * NewMatesPage
 * @returns JSX.Element
 */
const NewMatesPage = (): JSX.Element => {
  const [form] = Form.useForm<NewMatesFormType>();
  const [mates, setMates] = useState<NewMateType[]>([]);
  const [id, setId] = useState<number>(0);

  const [addMatesFn] = useMutation<{ addNewMates: [AddNewMatesReturn] }>(
    ADD_NEW_MATES,
    {
      onCompleted: (data) => {
        notification.success({
          message: `Successfully added ${data.addNewMates.length} new mates!`,
        });
        setMates([]);
      },
      onError: (error) => {
        notification.error({
          message: error.name,
          description: error.message,
        });
      },
      variables: {
        newMates: mates.map(
          ({ name, lastSynced }) => ({ name, lastSynced } as NewMatesInput)
        ),
      },
    }
  );

  const addNewMate = ({ name, lastSeen }: NewMatesFormType) => {
    const lastSynced = lastSeen === undefined ? new Date() : lastSeen.toDate();
    setMates((prevArray) => [...prevArray, { name, lastSynced, id }]);
    form.resetFields();
    setId(id + 1);
  };

  const removeMate = (mate: NewMateType) => {
    setMates((mateArr) => mateArr.filter((m8) => m8.id !== mate.id));
  };

  const cards = mates.map((mate) => (
    <Col span={6} key={mate.id}>
      <NewMatesCard mate={mate} removeMate={removeMate} />
    </Col>
  ));

  const pageUnsaved = mates.length > 0;

  return (
    <>
      <Prompt
        when={pageUnsaved}
        message="Leaving will erase all your unsaved info. Are you sure?"
      />
      <Layout style={{ minHeight: "100vh", paddingBottom: "75px" }}>
        <Row style={{ backgroundColor: "#F0F2F5", padding: "30px" }}>
          <Col>
            <Title>Populating M8s</Title>
          </Col>
        </Row>
        <Row
          style={{
            padding: "10px 30px",
          }}
        >
          <Col span={6}>
            <Title level={2}>Import From</Title>
          </Col>

          <Col>
            <Button type="primary" htmlType="submit">
              Google
            </Button>
          </Col>
        </Row>

        <Divider />
        <Row
          style={{
            padding: "10px 30px",
          }}
        >
          <Col span={6}>
            <Title level={2}>Manual Entry</Title>
          </Col>

          <Col>
            <Form layout="inline" form={form} onFinish={addNewMate}>
              <Form.Item label="Name" name="name" rules={[{ required: true }]}>
                <Input autoFocus />
              </Form.Item>
              <Form.Item label="Last Seen" name="lastSeen">
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
        <Footer
          style={{
            position: "fixed",
            bottom: "0",
            zIndex: 100,
            backgroundColor: "#FFFFFF",
            height: "75px",
            width: "100%"
           }}
        >
          <Row justify="space-between" align="middle">
            Once You’ve added all Your M8s (contacts) you can assign them to
            families
            <Button
              type="primary"
              disabled={!pageUnsaved}
              onClick={() => addMatesFn()}
            >
              Assign M8s to Families
            </Button>
          </Row>
        </Footer>
      </Layout>
    </>
  );
};

export default NewMatesPage;
