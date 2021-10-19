import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Modal, Row, Timeline, Typography } from "antd";
import React from "react";

import NewMateCard from "../../components/NewMateCard/NewMateCard";
import { NewMateType } from "../types";
import { family, matesObj, syncs } from "./mockData";

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
