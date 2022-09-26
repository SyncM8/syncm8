// import { useMutation } from "@apollo/client";
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
  Space,
  Typography,
} from "antd";
import { ClientResponseError, Record } from "pocketbase";
import React, { useState } from "react";
import { Prompt } from "react-router";

import { client } from "../../api";
import NewMatesCard from "../../components/NewMateCard/NewMateCard";
import { ADD_NEW_MATES, AddNewMatesReturn } from "../../graphql/graphql";
import { NewMatesInput } from "../../graphql/types";
import { NewMatesFormType, NewMateType } from "../types";
import { newMates } from "./mockData";

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

  // const [addMatesFn] = useMutation<{ addNewMates: [AddNewMatesReturn] }>(
  //   ADD_NEW_MATES,
  //   {
  //     onCompleted: (data) => {
  //       notification.success({
  //         message: `Successfully added ${data.addNewMates.length} new mates!`,
  //       });
  //       setMates([]);
  //     },
  //     onError: (error) => {
  //       notification.error({
  //         message: error.name,
  //         description: error.message,
  //       });
  //     },
  //     variables: {
  //       newMates: mates.map(
  //         ({ name, lastSynced }) => ({ name, lastSynced } as NewMatesInput)
  //       ),
  //     },
  //   }
  // );

  const saveMates = async () => {
    await client.users.refresh();
    const userId = client.authStore?.model?.id;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const unassignedFamilyId: string = client.authStore.model.profile.unassigned_family_id;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    console.log(client.authStore.model.profile)

    const matePromises = mates.map((mate: NewMateType) => 
      client.records.create("mates", {
          name: mate.name,
          user_id: userId,
          family_id: unassignedFamilyId
      }, { '$autoCancel': false }) // need to set to false otherwise bulk insert aborts
    );
    try {
      const mateResults = await Promise.all(matePromises);

      // create syncs
      const syncPromises = mateResults.map((mateRes: Record, index: number) => {
        const mate = mates[index];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (mate.name !== mateRes.name) {
          throw Error("Something went horribly wrong!");
        }
        return client.records.create("syncs", {
          timestamp: mate.lastSynced,
          title: "Initial Sync",
          user_id: userId,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          mate_id: mateRes.id
        }, { '$autoCancel': false }) // need to set to false otherwise bulk insert aborts
      });
      await Promise.all(syncPromises);

      notification.success({
        message: `Successfully added ${mates.length} new mates!`,
      });

      setMates([]);
    } catch (err) {
      notification.error({
        message: "Cannot create mates",
        description: JSON.stringify(err)
      })
    }
  }

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
        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Space>
            Once You’ve added all Your M8s (contacts) you can assign them to
            families
            <Button
              type="primary"
              disabled={!pageUnsaved}
              onClick={() => saveMates()}
            >
              Assign M8s to Families
            </Button>
          </Space>
        </Footer>
      </Layout>
    </>
  );
};

export default NewMatesPage;
