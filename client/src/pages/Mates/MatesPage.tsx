import { ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Modal,
  notification,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";

import { MateRecord } from "../types";
import { mockData } from "./mockData";

enum MatesSelectEnum {
  ACTIONS = "Actions",
  DELETE = "Delete",
  UNASSIGN = "Unassign",
}

/**
 * MatesPage
 * @returns
 */
const MatesPage = (): JSX.Element => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  /**
   * Confirm and delete selected mates
   */
  const deleteMates = (): void => {
    Modal.confirm({
      content:
        "Are you sure you want to delete these mates? Action cannot be reverted.",
      onOk: () => {
        notification.success({
          message: `Deleting ${selectedRowKeys.length} mates!`,
        });
      },
    });
  };

  /**
   * Confirm and unassign selected mates' families
   */
  const unassignMates = (): void => {
    Modal.confirm({
      content:
        "Are you sure you want to reassign these mates to unassigned family?",
      onOk: () => {
        notification.success({
          message: `Unassigning ${selectedRowKeys.length} mates!`,
        });
      },
    });
  };

  /**
   * Call appropriate selected action
   * @param value of select
   */
  const onSelect = (value: MatesSelectEnum): void => {
    switch (value) {
      case MatesSelectEnum.DELETE:
        deleteMates();
        break;
      case MatesSelectEnum.UNASSIGN:
        unassignMates();
        break;
      default:
        break;
    }
  };

  /**
   * Refetch mates data
   */
  const refetchData = () => {
    notification.info({
      message: "Refetching mates data...",
    });
  };

  const columns: ColumnsType<MateRecord> = [
    {
      title: "Mate",
      key: "mate",
      dataIndex: ["mate", "name"],
      sorter: (a, b) => a.mate.name.localeCompare(b.mate.name),
    },
    {
      title: "Family",
      key: "family",
      dataIndex: ["family", "name"],
      sorter: (a, b) => a.family.name.localeCompare(b.family.name),
    },
    {
      title: "Last Synced",
      key: "lastSynced",
      render: (text: string, record) => (
        <>{new Date(record.lastSync.timestamp).toLocaleString()}</>
      ),
      sorter: (a, b) =>
        a.lastSync.timestamp.localeCompare(b.lastSync.timestamp),
    },
    {
      title: "Number of Syncs",
      key: "numSyncs",
      dataIndex: "numSyncs",
      sorter: (a, b) => a.numSyncs - b.numSyncs,
    },
    {
      title: "Next Planned Sync Date",
      key: "nextSync",
      render: (text: string, record) => (
        <>{new Date(record.nextSync.timestamp).toLocaleString()}</>
      ),
      sorter: (a, b) =>
        a.nextSync.timestamp.localeCompare(b.nextSync.timestamp),
    },
    {
      title: "Family Sync Interval",
      key: "familySyncInterval",
      dataIndex: ["family", "sync_interval_days"],
      sorter: (a, b) =>
        a.family.sync_interval_days - b.family.sync_interval_days,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowKeys: React.Key[]) => setSelectedRowKeys(rowKeys),
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <Row gutter={8} justify="end">
        <Col>
          <Tooltip title="Reload data">
            <Button
              type="primary"
              onClick={refetchData}
              icon={<ReloadOutlined />}
            />
          </Tooltip>
        </Col>
        <Col>
          <Select
            dropdownMatchSelectWidth={200}
            defaultValue={MatesSelectEnum.ACTIONS}
            onSelect={onSelect}
          >
            <Select.Option
              value={MatesSelectEnum.DELETE}
              disabled={!hasSelected}
            >
              Delete
            </Select.Option>
            <Select.Option
              value={MatesSelectEnum.UNASSIGN}
              disabled={!hasSelected}
            >
              Unassign Family
            </Select.Option>
          </Select>
        </Col>
      </Row>
      <Table<MateRecord>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={mockData}
        bordered
        pagination={false}
      />
    </>
  );
};
export default MatesPage;
