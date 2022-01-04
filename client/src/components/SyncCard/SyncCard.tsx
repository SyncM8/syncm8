import "./SyncCard.css";

import {
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  CloseCircleTwoTone,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Card, Divider } from "antd";
import React, { CSSProperties } from "react";

import { SyncStatusEnum, SyncType } from "../../pages/types";

type SyncCardProps = {
  sync: SyncType;
  removeSync: (sync: SyncType) => void;
  editSync: (sync: SyncType) => void;
  style?: CSSProperties;
};

const { Meta } = Card;

const DetailsCutoff = 80;

const SyncCard = ({
  sync,
  removeSync,
  editSync,
  style,
}: SyncCardProps): JSX.Element => {
  let icon = null;
  if (sync.syncStatus === SyncStatusEnum.COMPLETED) {
    icon = <CheckCircleTwoTone twoToneColor="#52c41a" />;
  } else if (sync.syncStatus === SyncStatusEnum.DECLINED) {
    icon = <CloseCircleTwoTone twoToneColor="#ff4d4f" />;
  } else if (sync.syncStatus === SyncStatusEnum.SNOOZED) {
    icon = <ClockCircleTwoTone twoToneColor="#faad14" />;
  }
  const shortDetail =
    sync.details.length < DetailsCutoff
      ? sync.details
      : `${sync.details.substring(0, DetailsCutoff)}...`;
  return (
    <Card
      actions={[
        <EditOutlined key="edit" onClick={() => editSync(sync)} />,
        <DeleteOutlined key="delete" onClick={() => removeSync(sync)} />,
        <EllipsisOutlined key="ellipsis" />,
      ]}
      style={{
        ...style,
        borderRadius: 7,
        borderBottomRightRadius: 7,
        borderBottomLeftRadius: 7,
      }} // CSS magic
    >
      <Meta
        avatar={icon}
        title={sync.title.trim() || "No Title?"}
        description={sync.ts.toISOString().split("T")[0]}
      />
      {sync.details && <Divider />}
      {shortDetail}
    </Card>
  );
};

SyncCard.defaultProps = {
  style: {},
};

export default SyncCard;
