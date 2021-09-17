import {
  DeleteOutlined,
  EllipsisOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { FC } from "react";

import { AddMateType } from "../types";

type AddMateCardProps = {
  mate: AddMateType;
  removeMate: (mate: AddMateType) => void;
};

const { Meta } = Card;

const AddMateCard: FC<AddMateCardProps> = ({ mate, removeMate }) => (
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

export default AddMateCard;
