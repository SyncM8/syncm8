/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";

import { userNoUnassignedMates } from "../../graphql/mock";

const { Title } = Typography;
const { Option } = Select;

/**
 * ProfilePage
 * @returns
 */
const ProfilePage = (): JSX.Element => {
  const [form] = Form.useForm();
  const [, forceUpdate] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const showChangeModal = () => {
    setIsModalVisible2(true);
  };

  const handleDeleteOk = () => {
    setIsModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setIsModalVisible(false);
  };

  const handleChangeCancel = () => {
    setIsModalVisible2(false);
  };

  const handleChangeSave = () => {
    setIsModalVisible2(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    // eslint-disable-next-line no-console
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return e;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return e && e.fileList;
  };

  const [nameStr] = useState(userNoUnassignedMates.first_name);
  const [emailStr] = useState(userNoUnassignedMates.email);

  return (
    <>
      <Row>
        <Col span={10}>
          <div
            style={{
              backgroundColor: "#F0F2F5",
              height: "911px",
              padding: "100px",
            }}
          >
            <Row>
              <Col span={24} style={{ textAlign: "center" }}>
                <Avatar size={512} icon={<UserOutlined />} />
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={14}>
          <div
            style={{
              backgroundColor: "#FFFFFF",
              height: "911px",
              padding: "50px",
            }}
          >
            <Row justify="start">
              <Space direction="vertical" size={50}>
                <Card
                  title={<Title level={2}>Profile</Title>}
                  extra={
                    <>
                      <Button type="primary" onClick={showChangeModal}>
                        Change
                      </Button>
                      <Modal
                        title="Editing Profile"
                        centered
                        visible={isModalVisible2}
                        onOk={handleChangeSave}
                        onCancel={handleChangeCancel}
                        footer={[
                          <Button key="back" onClick={handleChangeCancel}>
                            Cancel
                          </Button>,
                          <Button
                            key="submit"
                            onClick={handleChangeSave}
                            type="primary"
                          >
                            Submit
                          </Button>,
                        ]}
                        bodyStyle={{ height: "500px" }}
                      >
                        <Card type="inner">
                          <Form
                            form={form}
                            name="horizontal_login"
                            layout="inline"
                            initialValues={{ remember: true }}
                            autoComplete="off"
                          >
                            <Form.Item
                              name="Profile Picture"
                              label="Profile Picture"
                              valuePropName="fileList"
                              getValueFromEvent={normFile}
                            >
                              <Upload
                                name="logo"
                                action="/upload.do"
                                listType="picture"
                              >
                                <Button icon={<UploadOutlined />}>
                                  Click to upload
                                </Button>
                              </Upload>
                            </Form.Item>
                          </Form>
                        </Card>
                        <Card type="inner">
                          <Form
                            form={form}
                            name="horizontal_login"
                            layout="inline"
                            initialValues={{ remember: true }}
                            autoComplete="off"
                          >
                            <Form.Item label="Name" labelAlign="left">
                              <Input
                                placeholder="Please enter a new name"
                                id="error"
                                style={{ width: 300 }}
                              />
                            </Form.Item>
                          </Form>
                        </Card>
                        <Card type="inner">
                          <Form
                            form={form}
                            name="horizontal_login"
                            layout="inline"
                            initialValues={{ remember: true }}
                            autoComplete="off"
                          >
                            <Form.Item label="Email Address" labelAlign="left">
                              <Input
                                placeholder="Please enter a new gmail account"
                                id="error"
                                style={{ width: 300 }}
                              />
                            </Form.Item>
                          </Form>
                        </Card>
                      </Modal>
                    </>
                  }
                  style={{ backgroundColor: "#FFFFFF", width: "950px" }}
                >
                  <p>Name: {nameStr}</p>
                  <p>Email Address: {emailStr}</p>

                  {/* <Card type="inner">
                    <Form
                      name="basic"
                      labelCol={{ span: 4 }}
                      wrapperCol={{ span: 8 }}
                      initialValues={{ remember: true }}
                      autoComplete="off"
                    >
                      <p>Phone Number</p>
                      <Form.Item
                        label="New Phone Number"
                        labelAlign="left"
                      >
                        <Input />
                      </Form.Item>
                    </Form>
                  </Card>
                  <Card type="inner" style={{ backgroundColor: "#F0F2F5" }}>
                    <p>Password</p>
                    <p>New Password</p>
                    <p>Confirm New Password</p>
                  </Card> */}
                </Card>
                <Card
                  title={<Title level={2}>Notification</Title>}
                  style={{ backgroundColor: "#FFFFFF", width: "950px" }}
                >
                  <Form.Item
                    name="Email Notification"
                    label="Email Notification"
                    rules={[{ required: true }]}
                    style={{ width: "250px" }}
                  >
                    <Select placeholder="Select">
                      <Option value="Never">Never</Option>
                      <Option value="Weekly">Weekly</Option>
                      <Option value="Bi-weekly">Bi-weekly</Option>
                      <Option value="Monthly">Monthly</Option>
                    </Select>
                  </Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={
                      !form.isFieldsTouched(true) ||
                      !!form
                        .getFieldsError()
                        .filter(({ errors }) => errors.length).length
                    }
                  >
                    Confirm
                  </Button>
                </Card>
                <Card
                  title={<Title level={2}>Danger Zone</Title>}
                  style={{
                    backgroundColor: "#FFFFFF",
                    width: "950px",
                    borderColor: "#FA541C",
                  }}
                >
                  <Form
                    form={form}
                    name="profile_delete"
                    layout="inline"
                    colon={false}
                  >
                    <Form.Item
                      label="Would you like to delete your profile?"
                      labelAlign="left"
                    >
                      <Button type="primary" onClick={showDeleteModal}>
                        Delete
                      </Button>
                      <Modal
                        title="Warning"
                        style={{ top: 100 }}
                        visible={isModalVisible}
                        onOk={handleDeleteOk}
                        onCancel={handleDeleteCancel}
                      >
                        <p>Are you sure you want to delete your profile?</p>
                      </Modal>
                    </Form.Item>
                  </Form>
                </Card>
              </Space>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProfilePage;
