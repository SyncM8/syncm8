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

import { client } from "../../api";
import { Family, getUser, Mate, Sync } from "../../utils";
// import { mockData } from "./mockData";

enum MatesSelectEnum {
  ACTIONS = "Actions",
  DELETE = "Delete",
  UNASSIGN = "Unassign",
}

export type MateRecord = {
  key: string;
  mate: Mate;
  family: Family;
  lastSync: Sync;
  nextSync: Sync;
  numSyncs: number;
};

/**
 * MatesPage
 * @returns
 */
const MatesPage = (): JSX.Element => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [mateRecords, setMateRecords] = useState<MateRecord[]>([]);

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

  const unassignMates = async () => {
    try {
      const user = await getUser();

      const updateMatesPromises = selectedRowKeys.map(mateKey => 
        client.records.update("mates", mateKey as unknown as string, {
          family_id: user.profile.unassigned_family_id
        }));
      await Promise.all(updateMatesPromises);
      notification.success({
        message: `Unassigned ${selectedRowKeys.length} mates!`,
      });
    } catch (err) {
      notification.error({
        message: "Unassigning mates failed",
        description: err
      })
    }
  }

  /**
   * Confirm and unassign selected mates' families
   */
  const unassignMatesConfirm = (): void => {
    Modal.confirm({
      content:
        "Are you sure you want to reassign these mates to unassigned family?",
      onOk: unassignMates,
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
        unassignMatesConfirm();
        break;
      default:
        break;
    }
  };

  /**
   * Refetch mates data
   */
  const refreshData = async () => {
    try {
      const mates = await client.records.getFullList("mates", 200, {
        expand: "family_id"
      });
      const sync: Sync = {
        id: "",
        timestamp: new Date(),
        title: "",
        description: "",
        user_id: "",
        mate_id: "",
        "@exapnd": {}
      }

      const mateData: MateRecord[] = mates.map(mate => ({
        key: mate.id,
        mate: (mate as unknown as Mate),
        family: (mate["@expand"]).family_id as unknown as Family,
        lastSync: sync,
        nextSync: sync,
        numSyncs: 0
      }));
            
      setMateRecords(mateData);
      console.log(mates);
    } catch (err) {
      notification.error({
        message: "Could not fetch mates",
        description: err
      })
    }
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
        +(a.lastSync.timestamp) - +(b.lastSync.timestamp),
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
        +(a.lastSync.timestamp) - +(b.lastSync.timestamp),
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

  React.useEffect(() => {
    // eslint-disable-next-line no-void
    void refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Row gutter={8} justify="end">
        <Col>
          <Tooltip title="Reload data">
            <Button
              type="primary"
              onClick={refreshData}
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
              disabled // TODO
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
        dataSource={mateRecords}
        bordered
        pagination={false}
      />
    </>
  );
};
export default MatesPage;
