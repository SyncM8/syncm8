import { Button, Col, Divider, Layout, Row, Space, Typography } from "antd";
import React, { useState } from "react";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "react-beautiful-dnd";
import { Prompt } from "react-router";

import FamilyDroppable from "../../components/FamilyDroppable/FamilyDroppable";
import { NewMateType } from "../types";

const { Title } = Typography;
const { Footer } = Layout;

// hardcoded data for demo
const philosophers = [
  "Thales",
  "Democritus",
  "Empedokles",
  "Pythagoras",
  "Socrates",
  "Plato",
  "Aristotle",
  "Diogenes",
  "Anaxagoras",
  "Euclides",
  "Antisthenes",
  "Epicurus",
  "Zeno of Citium",
];
const initialMates = philosophers.map(
  (name, index) =>
    ({
      name,
      lastSynced: new Date(),
      id: `mate-id-${index}`,
    } as NewMateType)
);
const families = ["school", "work", "life", "college", "concert"];
const initialGroup: Record<string, NewMateType[]> = families.reduce(
  (object, family) => ({
    ...object,
    [family]: [],
  }),
  { unassigned: initialMates }
);
// hardcoded data for demo

/**
 * Reorder an item in a list
 * @param list
 * @param startIndex original index of item
 * @param endIndex new index of item
 * @returns reordered list
 */
const reorder = <T,>(list: T[], startIndex: number, endIndex: number): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Move an item from one list to another
 * @param source list of items
 * @param destination list of items
 * @param droppableSource
 * @param droppableDestination
 * @returns altered lists
 */
const move = <T,>(
  source: T[],
  destination: T[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {
    [droppableSource.droppableId]: sourceClone,
    [droppableDestination.droppableId]: destClone,
  };

  return result;
};

/**
 * AssignMatesPage
 * @returns
 */
const AssignMatesPage = (): JSX.Element => {
  const [groups, setGroups] =
    useState<Record<string, NewMateType[]>>(initialGroup);

  /**
   * Removes a mate from this page
   * @param mate
   */
  const removeMate = (mate: NewMateType): void => {
    const newGroup: Record<string, NewMateType[]> = Object.keys(groups).reduce(
      (object, family) => ({
        ...object,
        [family]: groups[family].filter((m8) => m8.id !== mate.id),
      }),
      {}
    );
    setGroups(newGroup);
  };

  const submitNewAssignments = () => {
    // TODO send to backend here
  };

  /**
   * Calls when a user finishes dropping an item
   * @param result
   */
  const onDragEnd = ({ source, destination }: DropResult): void => {
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId) {
      const mates = reorder(
        groups[source.droppableId],
        source.index,
        destination.index
      );
      setGroups((prevGroup) => ({
        ...prevGroup,
        [destination.droppableId]: mates,
      }));
      return;
    }

    const res = move(
      groups[source.droppableId],
      groups[destination.droppableId],
      source,
      destination
    );

    setGroups((prevState) => ({
      ...prevState,
      ...res,
    }));
  };

  const pageUnsaved = Object.keys(groups)
    .filter((family) => family !== "unassigned")
    .some((family) => groups[family].length !== 0);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Prompt
        when={pageUnsaved}
        message="Leaving will erase all your unsaved info. Are you sure?"
      />
      <Layout style={{ minHeight: "100vh" }}>
        <Row style={{ backgroundColor: "#F0F2F5", padding: "30px" }}>
          <Col>
            <Title>Assigning M8s</Title>
          </Col>
        </Row>
        <Row style={{ padding: "30px" }}>
          <Col span={6}>
            <Title level={2}>Unassigned Mates</Title>
          </Col>
        </Row>
        <FamilyDroppable
          mates={groups.unassigned}
          direction="horizontal"
          family="unassigned"
          removeMate={removeMate}
        />
        <Divider />
        <Row wrap={false} style={{ overflow: "auto" }}>
          {Object.keys(groups)
            .filter((family) => family !== "unassigned")
            .map((family) => (
              <Col
                key={family}
                style={{ width: 220, marginLeft: 5, marginRight: 5 }}
              >
                <Row justify="center">
                  <Col>
                    <Title level={2}>{family}</Title>
                  </Col>
                </Row>
                <FamilyDroppable
                  mates={groups[family]}
                  family={family}
                  direction="vertical"
                  removeMate={removeMate}
                />
              </Col>
            ))}
        </Row>
        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Space>
            Once you’ve assigned all Your M8s (contacts), click to save
            <Button
              type="primary"
              disabled={!pageUnsaved}
              onClick={submitNewAssignments}
            >
              Save family assignments
            </Button>
          </Space>
        </Footer>
      </Layout>
    </DragDropContext>
  );
};

export default AssignMatesPage;
