import "./UnassignedMateCard.css";

import {
  DeleteOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { CSSProperties } from "react";

import { Mate } from "../../utils";

type UnassignedMateCardProps = {
  mate: Mate;
  lastSynced?: Date;
  removeMate: (mate: Mate) => void;
  style?: CSSProperties;
};

const { Meta } = Card;

const UnassignedMateCard = ({
  mate,
  lastSynced,
  removeMate,
  style,
}: UnassignedMateCardProps): JSX.Element => (
  <Card
    actions={[
      <DeleteOutlined key="delete" onClick={() => removeMate(mate)} />,
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
      avatar={<Avatar size="small" icon={<UserOutlined />} />}
      title={mate.name}
      description={
        lastSynced && `Last Synced: ${lastSynced.toLocaleDateString()}`
      }
    />
  </Card>
);

UnassignedMateCard.defaultProps = {
  style: {},
  lastSynced: undefined,
};

export default UnassignedMateCard;
