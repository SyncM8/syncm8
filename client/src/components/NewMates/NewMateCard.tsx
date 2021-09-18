import {
  DeleteOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { FC } from "react";

import { NewMateType } from "../types";

type NewMateCardProps = {
  mate: NewMateType;
  removeMate: (mate: NewMateType) => void;
};

const { Meta } = Card;

const NewMateCard: FC<NewMateCardProps> = ({ mate, removeMate }) => (
  <Card
    actions={[
      <DeleteOutlined key="delete" onClick={() => removeMate(mate)} />,
      <EllipsisOutlined key="ellipsis" />,
    ]}
  >
    <Meta
      avatar={<Avatar size="small" icon={<UserOutlined />} />}
      title={mate.name}
      description={`Last Synced: ${mate.lastSynced.toLocaleDateString()}`}
    />
  </Card>
);

export default NewMateCard;
