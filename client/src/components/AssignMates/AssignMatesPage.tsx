/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Popover,
  Row,
  Space,
  Typography,
} from "antd";
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
const families = ["school", "work"];
const initialGroup: Record<string, NewMateType[]> = families.reduce(
  (object, family) => ({
    ...object,
    [family]: [],
  }),
  { unassigned: initialMates }
);
// hardcoded data for demo

const grid = 8;
// horizontal
const getItemStyle = (
  draggableStyle: StyleType,
  isDragging: boolean
): CSSType => ({
  userSelect: "none",
  background: isDragging ? "lightgreen" : "grey",
  padding: 8,
  margin: `0 8px 0 0`,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: 8,
  overflow: "auto",
  minHeight: 125,
});

// vertical
const verticalGetItemStyle = (
  draggableStyle: StyleType,
  isDragging: boolean
): CSSType => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle,
});

const verticalGetListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250,
  minHeight: 125,
  // display: "flex"  // don't add this
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

type NewFamilyFormType = {
  familyName: string;
};

const AssignMatesPage = (): JSX.Element => {
  const [form] = Form.useForm<NewFamilyFormType>();
  const [groups, setGroups] =
    useState<Record<string, NewMateType[]>>(initialGroup);

  const addNewFamily = async ({ familyName }: NewFamilyFormType) => {
    if (Object.keys(groups).includes(familyName)) {
      await message.error(`Family name ${familyName} already exists`);
    } else {
      await message.success(`Added ${familyName}`);
      setGroups((prevGroup) => ({
        ...prevGroup,
        [familyName]: [],
      }));
    }
    form.resetFields();
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Layout style={{ minHeight: "100vh" }}>
        <Row style={{ backgroundColor: "#F0F2F5", padding: "30px" }}>
          <Col>
            <Title>Populating M8s</Title>
          </Col>
        </Row>
        <Row style={{ padding: "30px" }}>
          <Col span={6}>
            <Title level={2}>Unassigned Mates</Title>
          </Col>
          <Col>
            <Form layout="inline" form={form} onFinish={addNewFamily}>
              <Form.Item
                label="FamilyName"
                name="familyName"
                rules={[{ required: true }]}
              >
                <Input autoFocus />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add New Family
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Droppable droppableId="unassigned" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
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
                      style={getItemStyle(
                        draggableProvided.draggableProps.style,
                        draggableSnapshot.isDragging
                      )}
                    >
                      <NewMatesCard
                        mate={item}
                        style={{ width: 200 }}
                        removeMate={(rMate) =>
                          console.log("pressed remove", rMate)
                        }
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {Object.keys(groups)
          .filter((key) => key !== "unassigned")
          .map((key) => (
            <span key={key} style={{ float: "left", display: "inline-grid" }}>
              <Divider />

              <Row style={{ padding: "30px" }}>
                <Col span={6}>
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
                              removeMate={(rMate) =>
                                console.log("pressed remove", rMate)
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </span>
          ))}

        <Footer style={{ position: "sticky", bottom: "0" }}>
          <Space>
            Once you’ve assigned all Your M8s (contacts), click to save
            <Button
              type="primary"
              // disabled={!pageUnsaved}
              // onClick={submitNewMates}
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
