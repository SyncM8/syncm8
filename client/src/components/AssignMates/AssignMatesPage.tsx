/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Divider, Layout, Row, Space, Typography } from "antd";
import React, { CSSProperties, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { Prompt } from "react-router";

import NewMatesCard from "../NewMates/NewMateCard";
import { NewMateType } from "../types";

const { Title } = Typography;
const { Footer } = Layout;

type StyleType = DraggingStyle | NotDraggingStyle | undefined;
type CSSType = CSSProperties | undefined;

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

// horizontal
const horizontalGetItemStyle = (
  draggableStyle: StyleType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDragging: boolean
): CSSType => ({
  userSelect: "none",
  margin: "0 8px 0 0",
  ...draggableStyle,
});

const horizontalGetListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: 8,
  overflow: "auto",
  minHeight: 125,
});

// vertical
const verticalGetItemStyle = (
  draggableStyle: StyleType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDragging: boolean
): CSSType => ({
  userSelect: "none",
  margin: "0 auto 8px auto",
  width: 200,
  ...draggableStyle,
});

const verticalGetListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: 8,
  width: 220,
  minHeight: 125,
  borderRadius: 5,
});

const reorder = (list: NewMateType[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (
  source: NewMateType[],
  destination: NewMateType[],
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

const AssignMatesPage = (): JSX.Element => {
  const [groups, setGroups] =
    useState<Record<string, NewMateType[]>>(initialGroup);

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
        <Droppable droppableId="unassigned" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={horizontalGetListStyle(snapshot.isDraggingOver)}
            >
              {groups.unassigned.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={item.id as string}
                  index={index}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={horizontalGetItemStyle(
                        draggableProvided.draggableProps.style,
                        draggableSnapshot.isDragging
                      )}
                    >
                      <NewMatesCard
                        mate={item}
                        style={{ width: 200 }}
                        removeMate={removeMate}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Row wrap={false} style={{ overflow: "auto" }}>
          {Object.keys(groups)
            .filter((key) => key !== "unassigned")
            .map((key) => (
              <Col
                key={key}
                style={{ width: 220, marginLeft: 5, marginRight: 5 }}
              >
                <Divider />
                <Row justify="center">
                  <Col>
                    <Title level={2}>{key}</Title>
                  </Col>
                </Row>
                <Droppable droppableId={key} direction="vertical">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={verticalGetListStyle(snapshot.isDraggingOver)}
                    >
                      {groups[key].map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id as string}
                          index={index}
                        >
                          {(draggableProvided, draggableSnapshot) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              style={verticalGetItemStyle(
                                draggableProvided.draggableProps.style,
                                draggableSnapshot.isDragging
                              )}
                            >
                              <NewMatesCard
                                mate={item}
                                style={{ width: 200 }}
                                removeMate={removeMate}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
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
