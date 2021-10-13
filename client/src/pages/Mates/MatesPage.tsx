/* eslint-disable no-plusplus */
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Timeline,
  Typography,
} from "antd";
import moment from "moment";
import React, { useState } from "react";

import SyncCard from "../../components/SyncCard/SyncCard";
import { SyncStatusEnum, SyncType } from "../types";

type MatesPageState = {
  isModalVisible: boolean;
  syncs: SyncType[];
  editingSync: SyncType;
};

enum SyncModalEnum {
  TITLE = "Title",
  DATE = "Date",
  DETAILS = "Details",
  SYNC_STATUS = "SyncStatus",
}

/* Hardcoded data below */
let id = 0;
const mateName = "Clare Carlisle";
const initialSyncs: SyncType[] = [
  {
    id: id++,
    ts: new Date("2021-09-01"),
    title: "Dinner at Chipotle",
    details: "Got a chicken bowl with guacs. Talked about K.",
    syncStatus: SyncStatusEnum.COMPLETED,
  },
  {
    id: id++,
    ts: new Date("2021-04-09"),
    title: "Coffee at Starbucks",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.COMPLETED,
  },
  {
    id: id++,
    ts: new Date("2021-06-19"),
    title: "Snoozed One",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.SNOOZED,
  },
  {
    id: id++,
    ts: new Date("2021-07-15"),
    title: "Busy with Work",
    details: "",
    syncStatus: SyncStatusEnum.DECLINED,
  },
  {
    id: id++,
    ts: new Date("2021-07-21"),
    title: "Hiking at Stone Mountain",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.COMPLETED,
  },
  {
    id: id++,
    ts: new Date("2021-08-31"),
    title: "Flaky?",
    details:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    syncStatus: SyncStatusEnum.DECLINED,
  },
];

const newSync = {
  id: id++,
  ts: new Date(),
  title: "New Title",
  details: "Details here...",
  syncStatus: SyncStatusEnum.DECLINED,
};
/* Hardcoded data above */

const { confirm } = Modal;
const { Title } = Typography;

/**
 * MatePage
 * @returns
 */
const MatesPage = (): JSX.Element => {
  const [state, setState] = useState<MatesPageState>({
    syncs: initialSyncs,
    isModalVisible: false,
    editingSync: newSync,
  });
  const { syncs, isModalVisible, editingSync } = state;

  /**
   * Removes specified sync
   * @param sync
   */
  const removeSync = (sync: SyncType) => {
    confirm({
      title: `Are you sure you want to delete this sync: ${sync.title}?`,
      icon: <ExclamationCircleOutlined />,
      content: "This operation cannot be reversed",
      okText: "Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // TODO server
        setState({
          ...state,
          syncs: state.syncs.filter((s) => s.id !== sync.id),
        });
      },
    });
  };

  /**
   * Open modal to edit specified sync
   * @param sync to be edited
   */
  const openEditSyncModal = (sync: SyncType) => {
    setState({ ...state, isModalVisible: true, editingSync: { ...sync } });
  };

  /**
   * Add a new sync then edit
   */
  const addSync = () => {
    openEditSyncModal({
      id: id++,
      title: "",
      details: "",
      ts: new Date(),
      syncStatus: SyncStatusEnum.COMPLETED,
    });
  };

  /**
   * Handle save on editing sync
   * TODO: save on server
   */
  const handleSaveEditSync = () => {
    const newSyncs = [
      ...syncs.filter((sync) => sync.id !== editingSync.id),
      editingSync,
    ];
    setState({ ...state, syncs: newSyncs, isModalVisible: false });
  };

  /**
   * Turn off editing modal
   */
  const closeEditModal = () => {
    setState({ ...state, isModalVisible: false });
  };

  /**
   * Handle changing form values on editing sync
   * @param label of sync to change
   * @param value new value to replace
   */
  const changeFormValue = (label: SyncModalEnum, value: string) => {
    let newEditingSync = { ...editingSync };
    switch (label) {
      case SyncModalEnum.TITLE:
        newEditingSync = { ...editingSync, title: value };
        break;
      case SyncModalEnum.DATE:
        newEditingSync = { ...editingSync, ts: new Date(value) };
        break;
      case SyncModalEnum.DETAILS:
        newEditingSync = { ...editingSync, details: value };
        break;
      case SyncModalEnum.SYNC_STATUS: {
        const syncStatus = value as SyncStatusEnum;
        if (Object.values(SyncStatusEnum).indexOf(syncStatus) < 0) {
          console.error("Unknown sync status value"); // eslint-disable-line no-console
        }
        newEditingSync = { ...editingSync, syncStatus };
        break;
      }
      default:
        break;
    }
    setState({ ...state, editingSync: newEditingSync });
  };

  const ModalForm = (
    <Modal
      visible={isModalVisible}
      onOk={handleSaveEditSync}
      onCancel={closeEditModal}
      okText="Save"
    >
      <Form layout="vertical">
        <Form.Item label="Title">
          <Input
            value={editingSync.title}
            placeholder="New Title"
            onChange={(e) =>
              changeFormValue(SyncModalEnum.TITLE, e.target.value)
            }
            required
          />
        </Form.Item>
        <Form.Item label="Date">
          <DatePicker
            value={moment.utc(editingSync.ts)} // moment defaults to local time, while JS's Date is UTC
            onChange={(date, dateString) =>
              changeFormValue(SyncModalEnum.DATE, dateString)
            }
          />
        </Form.Item>
        <Form.Item label="Details">
          <Input.TextArea
            autoSize
            value={editingSync.details}
            placeholder="Add details here..."
            onChange={(e) =>
              changeFormValue(SyncModalEnum.DETAILS, e.target.value)
            }
          />
        </Form.Item>
        <Form.Item label="Sync Status">
          <Select
            value={editingSync.syncStatus}
            onChange={(value) =>
              changeFormValue(SyncModalEnum.SYNC_STATUS, value)
            }
          >
            {Object.entries(SyncStatusEnum).map(([syncStatus, value]) => (
              <Select.Option key={syncStatus} value={value}>
                {syncStatus}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );

  return (
    <>
      {ModalForm}
      <Row>
        <Col span={18}>
          <div
            style={{
              backgroundColor: "#F0F2F5",
              height: "200px",
              padding: "20px",
            }}
          >
            <Title level={5}>M8</Title>
            <Title>{mateName}</Title>
            <Title level={5}>Syncs: Weekly</Title>
          </div>
          <div style={{ backgroundColor: "#F7F8FC", padding: "20px" }}>
            <Row gutter={[24, 24]}>
              {syncs
                .sort((a, b) => b.ts.valueOf() - a.ts.valueOf())
                .map((sync) => (
                  <Col span={6} key={sync.id}>
                    <SyncCard
                      sync={sync}
                      editSync={openEditSyncModal}
                      removeSync={removeSync}
                    />
                  </Col>
                ))}
            </Row>
          </div>
          <div style={{ position: "sticky", bottom: "0", right: "0" }}>
            <Button
              type="primary"
              size="large"
              icon={<PlusCircleOutlined />}
              onClick={addSync}
            >
              Add Sync
            </Button>
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
                {syncs
                  .sort((a, b) => a.ts.valueOf() - b.ts.valueOf())
                  .map((sync) => (
                    <Timeline.Item
                      key={sync.id}
                      label={sync.ts.toISOString().split("T")[0]}
                    >
                      {sync.title}
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

export default MatesPage;
