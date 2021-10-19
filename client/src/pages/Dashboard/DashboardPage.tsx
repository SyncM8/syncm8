import {
  CalendarOutlined,
  CarryOutOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Popover,
  Row,
  Timeline,
  Typography,
} from "antd";
import moment from "moment";
import React, { useState } from "react";

import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { syncs as timelineSyncs } from "../Families/mockData";
import { UpcomingSyncType } from "../types";
import { initialSyncs, name, today } from "./mockData";

const { Title } = Typography;

enum EditModalEnum {
  SUMMARY = "Summary",
  RESCHEDULE = "Reschedule",
}

type DashboardPageState = {
  syncs: UpcomingSyncType[];
  isModalVisible: boolean;
  editingSync: UpcomingSyncType;
  editingMode: EditModalEnum;
  editingInfo: {
    title: string;
    details: string;
    date: Date;
  };
};

/**
 * DashboardPage
 * @returns JSX.Element
 */
const DashboardPage = (): JSX.Element => {
  const [state, setState] = useState<DashboardPageState>({
    syncs: initialSyncs,
    isModalVisible: false,
    editingSync: initialSyncs[0],
    editingMode: EditModalEnum.SUMMARY,
    editingInfo: {
      title: "",
      details: "",
      date: new Date(),
    },
  });

  const { syncs, isModalVisible, editingSync, editingInfo, editingMode } =
    state;

  /**
   * remove specified sync from Dashboard
   * @param sync to be removed
   */
  const removeSync = (sync: UpcomingSyncType) => {
    setState({ ...state, syncs: syncs.filter((s) => sync.id !== s.id) });
  };

  /**
   * open modal to change sync information
   * @param sync to be added
   */
  const openEditModal = (sync: UpcomingSyncType, mode: EditModalEnum) => {
    setState({
      ...state,
      isModalVisible: true,
      editingSync: sync,
      editingMode: mode,
      editingInfo: { title: "", details: "", date: sync.upcomingSync },
    });
  };

  const previousSyncs = syncs
    .filter((sync) => sync.upcomingSync < today)
    .sort((a, b) => b.upcomingSync.valueOf() - a.upcomingSync.valueOf());

  const upcomingSyncs = syncs
    .filter((sync) => sync.upcomingSync > today)
    .sort((a, b) => a.upcomingSync.valueOf() - b.upcomingSync.valueOf());

  const PreviousSyncsNode = (
    <>
      <Row justify="center">
        <Col>
          <Title level={3}>Previous Syncs</Title>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {previousSyncs.map((sync) => (
          <Col span={6} key={sync.id}>
            <DashboardCard
              upcomingSync={sync}
              actions={[
                <Popover
                  content="Synced"
                  placement="bottom"
                  key={`${sync.id}-check`}
                >
                  <CheckOutlined onClick={() => removeSync(sync)} />
                </Popover>,
                <Popover
                  content="Synced, write summary"
                  placement="bottom"
                  key={`${sync.id}-edit`}
                >
                  <EditOutlined
                    onClick={() => openEditModal(sync, EditModalEnum.SUMMARY)}
                  />
                </Popover>,
                <Popover
                  content="Decline this sync"
                  placement="bottom"
                  key={`${sync.id}-close`}
                >
                  <CloseOutlined onClick={() => removeSync(sync)} />
                </Popover>,
                <Popover
                  content="Reschedule sync"
                  placement="bottom"
                  key={`${sync.id}-calendar`}
                >
                  <CalendarOutlined
                    onClick={() =>
                      openEditModal(sync, EditModalEnum.RESCHEDULE)
                    }
                  />
                </Popover>,
              ]}
            />
          </Col>
        ))}
      </Row>
    </>
  );

  /**
   * Saves the editing sync
   */
  const handleModalSave = () => {
    // TODO handle server saving
    setState({
      ...state,
      syncs: syncs.filter((s) => editingSync.id !== s.id),
      isModalVisible: false,
    });
  };

  const summaryForm = (
    <>
      <Form.Item label="Title">
        <Input
          value={editingInfo.title}
          placeholder="New Title"
          onChange={(e) =>
            setState({
              ...state,
              editingInfo: { ...editingInfo, title: e.target.value },
            })
          }
        />
      </Form.Item>
      <Form.Item label="Details">
        <Input.TextArea
          autoSize
          value={editingInfo.details}
          placeholder="Add details here..."
          onChange={(e) =>
            setState({
              ...state,
              editingInfo: { ...editingInfo, details: e.target.value },
            })
          }
        />
      </Form.Item>
    </>
  );

  const rescheduleForm = (
    <Form.Item label="Reschedule">
      <DatePicker
        value={moment.utc(editingInfo.date)} // moment defaults to local time, while JS's Date is UTC
        onChange={(date, dateString) =>
          setState({
            ...state,
            editingInfo: { ...editingInfo, date: new Date(dateString) },
          })
        }
      />
    </Form.Item>
  );

  const SyncModal = (
    <Modal
      onCancel={() => setState({ ...state, isModalVisible: false })}
      onOk={handleModalSave}
      visible={isModalVisible}
      okText="Save"
    >
      <Form layout="vertical">
        <Form.Item label="M8">
          <Input value={editingSync.name} disabled />
        </Form.Item>
        <Form.Item label="Sync Date">
          <Input
            value={editingSync.upcomingSync.toLocaleDateString()}
            disabled
          />
        </Form.Item>
        {editingMode === EditModalEnum.SUMMARY ? summaryForm : rescheduleForm}
      </Form>
    </Modal>
  );

  const UpcomingSyncsNode = (
    <>
      {SyncModal}
      <Row justify="center">
        <Col>
          <Title level={3}>Upcoming Syncs</Title>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {upcomingSyncs.map((sync) => (
          <Col span={6} key={sync.id}>
            <DashboardCard
              upcomingSync={sync}
              actions={[
                <Popover
                  content="Already scheduled, remove from feed"
                  placement="bottom"
                  key={`${sync.id}-carryout`}
                >
                  <CarryOutOutlined onClick={() => removeSync(sync)} />
                </Popover>,
                <Popover
                  content="Decline this sync"
                  placement="bottom"
                  key={`${sync.id}-close`}
                >
                  <CloseOutlined onClick={() => removeSync(sync)} />
                </Popover>,
              ]}
            />
          </Col>
        ))}
      </Row>
    </>
  );

  return (
    <>
      <Row>
        <Col span={18}>
          <div
            style={{
              backgroundColor: "#F0F2F5",
              height: "150px",
              padding: "20px",
            }}
          >
            <Title style={{ fontSize: "92px" }}>Hi, {name}</Title>
          </div>
          <div style={{ backgroundColor: "#F7F8FC", padding: "20px" }}>
            {PreviousSyncsNode}
            <Divider />
            {UpcomingSyncsNode}
          </div>
        </Col>
        <Col
          span={6}
          className="timeline-sidebar"
          style={{ height: "inherit" }}
        >
          <Row justify="center">
            <Col>
              <Title level={2}>Timeline</Title>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={20}>
              <Timeline mode="left" reverse>
                {timelineSyncs
                  .sort(
                    (a, b) => a.lastSynced.valueOf() - b.lastSynced.valueOf()
                  )
                  .map((sync) => (
                    <Timeline.Item
                      key={sync.id}
                      label={sync.lastSynced.toLocaleDateString()}
                    >
                      {sync.name}
                    </Timeline.Item>
                  ))}
              </Timeline>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default DashboardPage;
