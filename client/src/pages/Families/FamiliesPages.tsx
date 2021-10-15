import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Timeline, Typography } from "antd";
import React from "react";

import NewMateCard from "../../components/NewMateCard/NewMateCard";
import { NewMateType } from "../types";

/* Hardcoded data below */
const family = "College";
export const syncs: NewMateType[] = [
  {
    name: "George Washington",
    lastSynced: new Date("2021-09-01"),
    id: 1,
  },
  {
    name: "John Adams",
    lastSynced: new Date("2021-08-29"),
    id: 2,
  },
  {
    name: "Thomas Jefferson",
    lastSynced: new Date("2021-08-13"),
    id: 3,
  },
  {
    name: "James Madison",
    lastSynced: new Date("2021-08-13"),
    id: 4,
  },
  {
    name: "John Adams",
    lastSynced: new Date("2021-09-13"),
    id: 5,
  },
  {
    name: "James Madison",
    lastSynced: new Date("2021-06-09"),
    id: 6,
  },
  {
    name: "John Quincy Adams",
    lastSynced: new Date("2021-07-13"),
    id: 7,
  },
  {
    name: "James Madison",
    lastSynced: new Date("2021-09-11"),
    id: 8,
  },
  {
    name: "John Quincy Adams",
    lastSynced: new Date("2021-04-12"),
    id: 9,
  },
  {
    name: "Andrew Jackson ",
    lastSynced: new Date("2021-04-22"),
    id: 10,
  },
  {
    name: "Martin Van Buren ",
    lastSynced: new Date("2021-04-22"),
    id: 11,
  },
];

const matesObj = syncs.reduce((prevObj: Record<string, NewMateType>, sync) => {
  if (
    !(sync.name in prevObj) ||
    prevObj[sync.name].lastSynced > sync.lastSynced
  ) {
    return { ...prevObj, [sync.name]: sync };
  }
  return prevObj;
}, {});
/* Hardcoded data above */

const { confirm } = Modal;
const { Title } = Typography;

/**
 * FamiliesPage
 * @returns
 */
const FamiliesPage = (): JSX.Element => {
  /**
   * Remove mate from server
   * @param mate to be removed
   */
  const removeMate = (mate: NewMateType): void => {
    confirm({
      title: `Are you sure you want to delete ${mate.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: "This operation cannot be reversed",
      okText: "Delete",
      okType: "danger",
      cancelText: "No",
      onOk() {
        // TODO
        console.log("Delete mate"); // eslint-disable-line no-console
      },
    });
  };
  return (
    <>
      <Row>
        <Col span={18}>
          <div
            style={{
              backgroundColor: "#F0F2F5",
              height: "200px",
              padding: "20px",
            }}
          >
            <Title level={5}>Family</Title>
            <Title>{family}</Title>
            <Title level={5}>Syncs: Weekly</Title>
          </div>
          <div style={{ backgroundColor: "#F7F8FC", padding: "20px" }}>
            <Row gutter={[24, 24]}>
              {Object.values(matesObj).map((mate) => (
                <Col span={6} key={mate.id}>
                  <NewMateCard mate={mate} removeMate={removeMate} />
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col span={6} className="timeline-sidebar" style={{ height: "100vh" }}>
          <Row justify="center">
            <Col>
              <Title level={2}>Timeline</Title>
            </Col>
          </Row>
          <Row justify="center">
            <Col span={20}>
              <Timeline mode="left" reverse>
                {syncs
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

export default FamiliesPage;
