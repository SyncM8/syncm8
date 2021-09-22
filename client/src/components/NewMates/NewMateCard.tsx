import "./NewMatePage.css";

import {
  DeleteOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { CSSProperties } from "react";

import { NewMateType } from "../types";

type NewMateCardProps = {
  mate: NewMateType;
  removeMate: (mate: NewMateType) => void;
  style?: CSSProperties;
};

const { Meta } = Card;

const NewMateCard = ({
  mate,
  removeMate,
  style,
}: NewMateCardProps): JSX.Element => (
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
      description={`Last Synced: ${mate.lastSynced.toLocaleDateString()}`}
    />
  </Card>
);

NewMateCard.defaultProps = {
  style: {},
};

export default NewMateCard;
