/* eslint-disable no-plusplus */
import {
  CalendarOutlined,
  CarryOutOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Col, Divider, Popover, Row, Timeline, Typography } from "antd";
import React, { useState } from "react";

import DashboardCard from "../../components/DashboardCard/DashboardCard";
import { syncs as timelineSyncs } from "../Families/FamiliesPages";
import { UpcomingSyncType } from "../types";

const { Title } = Typography;

type DashboardPageState = {
  syncs: UpcomingSyncType[];
  isModalVisible: boolean;
};

let id = 0;
const today = new Date(2021, 9, 15); // month is 0-index, equivalent to "2021-10-15"
const initialSyncs: UpcomingSyncType[] = [
  {
    id: id++,
    name: "Peter",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 1),
  },
  {
    id: id++,
    name: "Andrew",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 4),
  },
  {
    id: id++,
    name: "James",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 5),
  },
  {
    id: id++,
    name: "John",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 8),
  },
  {
    id: id++,
    name: "Bartholomew",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 10),
  },
  {
    id: id++,
    name: "Matthew",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 16),
  },
  {
    id: id++,
    name: "Thomas",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 18),
  },
  {
    id: id++,
    name: "Simon",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 20),
  },
  {
    id: id++,
    name: "Judas",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 20),
  },
  {
    id: id++,
    name: "Philip",
    family: "Twelves",
    lastSynced: new Date(2021, 8, 1),
    upcomingSync: new Date(2021, 9, 17),
  },
];

const DashboardPage = (): JSX.Element => {
  const [state, setState] = useState<DashboardPageState>({
    syncs: initialSyncs,
    isModalVisible: false,
  });

  const { syncs, isModalVisible } = state;

  const removeSync = (syncId: number) => {
    setState({ ...state, syncs: syncs.filter((sync) => sync.id !== syncId) });
  };

  const addSyncSummary = (syncId: number) => {
    setState({ ...state, isModalVisible: true });
    console.log(isModalVisible, syncId); // eslint-disable-line no-console
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
                  <CheckOutlined onClick={() => removeSync(sync.id)} />
                </Popover>,
                <Popover
                  content="Synced, write summary"
                  placement="bottom"
                  key={`${sync.id}-edit`}
                >
                  <EditOutlined onClick={() => addSyncSummary(sync.id)} />
                </Popover>,
                <Popover
                  content="Decline this sync"
                  placement="bottom"
                  key={`${sync.id}-close`}
                >
                  <CloseOutlined onClick={() => removeSync(sync.id)} />
                </Popover>,
                <Popover
                  content="Reschedule sync"
                  placement="bottom"
                  key={`${sync.id}-calendar`}
                >
                  <CalendarOutlined onClick={() => removeSync(sync.id)} />
                </Popover>,
              ]}
            />
          </Col>
        ))}
      </Row>
    </>
  );

  const UpcomingSyncsNode = (
    <>
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
                  <CarryOutOutlined onClick={() => removeSync(sync.id)} />
                </Popover>,
                <Popover
                  content="Decline this sync"
                  placement="bottom"
                  key={`${sync.id}-close`}
                >
                  <CloseOutlined onClick={() => removeSync(sync.id)} />
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
            <Title>Hi, Paul</Title>
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
