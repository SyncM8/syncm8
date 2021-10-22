import "./DashboardCard.css";

import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React, { CSSProperties } from "react";

import { UpcomingSyncType } from "../../pages/types";

type DashboardCardProps = {
  upcomingSync: UpcomingSyncType;
  actions: React.ReactNode[];
  style?: CSSProperties;
};

const { Meta } = Card;

const DashboardCard = ({
  upcomingSync,
  actions,
  style,
}: DashboardCardProps): JSX.Element => (
  <Card
    actions={actions}
    style={{
      ...style,
      borderRadius: 7,
      borderBottomRightRadius: 7,
      borderBottomLeftRadius: 7,
    }} // CSS magic
  >
    <Meta
      avatar={<Avatar size="small" icon={<UserOutlined />} />}
      title={upcomingSync.name}
      description={`
      Last Synced: ${upcomingSync.lastSynced.toLocaleDateString()}
      Upcoming Sync: ${upcomingSync.upcomingSync.toLocaleDateString()}
      Family: ${upcomingSync.family}
      `}
    />
  </Card>
);

DashboardCard.defaultProps = {
  style: {},
};

export default DashboardCard;
