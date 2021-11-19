import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  Layout,
  notification,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "react-beautiful-dnd";
import { Prompt } from "react-router";

import FamilyDroppable from "../../components/FamilyDroppable/FamilyDroppable";
import {
  ASSIGN_MATES_TO_FAMILIES,
  GET_UNASSIGNED_DATA,
} from "../../graphql/graphql";
import { Family, Mate, User } from "../../graphql/types";
import { UnassignedMate } from "../types";

const { Title } = Typography;
const { Footer } = Layout;

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
 * Create UnassignedMate from mate's syncs
 * @param mate
 * @returns UnassignedMate with lastSynced
 */
const populateLastSynced = (mate: Mate): UnassignedMate => {
  if (mate.syncs?.length > 0) {
    const date = mate.syncs.reduce(
      (prev, cur) => (prev > cur ? prev : cur),
      mate.syncs[0]
    );
    return {
      ...mate,
      lastSynced: new Date(date.timestamp),
    };
  }
  return { ...mate };
};

/**
 * AssignMatesPage
 * @returns
 */
const AssignMatesPage = (): JSX.Element => {
  const [groups, setGroups] = useState<Record<string, UnassignedMate[]>>({});
  const [familyMap, setFamilyMap] = useState<Record<string, Family>>({});
  const [unassignedId, setUnassignedId] = useState("");
  const [isAllAssigned, setIsAllAssigned] = useState(false);

  /**
   * GQL Query to fetch unassigned mates and families info
   */
  const [getUnassignedData] = useLazyQuery<{ getUserData: User }>(
    GET_UNASSIGNED_DATA,
    {
      onCompleted: (data) => {
        const { unassigned_family: unassignedFamily, families } =
          data.getUserData;
        const newFamilies = families.reduce(
          (object, family) => ({
            ...object,
            [family.id]: family,
          }),
          {}
        );
        setFamilyMap(newFamilies);
        setIsAllAssigned(unassignedFamily.mates.length === 0);

        const initialGroup = {
          [unassignedFamily.id]: unassignedFamily.mates.map(populateLastSynced),
        };

        const newGroups = families
          .filter((family) => family.id !== unassignedFamily.id)
          .reduce(
            (object, family) => ({
              ...object,
              [family.id]: [],
            }),
            initialGroup
          );
        setGroups(newGroups);
        setUnassignedId(unassignedFamily.id);
      },
      onError: (error) => {
        notification.error({
          message: error.name,
          description: error.message,
        });
      },
      fetchPolicy: "network-only",
    }
  );

  /**
   * GQL Mutation for assigning mates
   */
  const [assignMatesFn] = useMutation<{ assignMatesToFamilies: string[] }>(
    ASSIGN_MATES_TO_FAMILIES,
    {
      onCompleted: (data) => {
        notification.success({
          message: `Assigned ${data.assignMatesToFamilies.length} mates!`,
        });
        getUnassignedData();
      },
      onError: (error) => {
        notification.error({
          message: error.name,
          description: error.message,
        });
      },
    }
  );

  useEffect(() => {
    getUnassignedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Removes a mate from this page
   * @param mate
   */
  const removeMate = (mate: Mate): void => {
    // TODO: delete mate from DB
    const newGroup: Record<string, Mate[]> = Object.keys(groups).reduce(
      (object, family) => ({
        ...object,
        [family]: groups[family].filter((m8) => m8.id !== mate.id),
      }),
      {}
    );
    setGroups(newGroup);
  };

  /**
   * Submit mate assignments to server
   */
  const submitNewAssignments = async () => {
    const newAssignments = Object.keys(groups)
      .filter((familyId) => familyId !== unassignedId)
      .map((familyId) => ({
        familyId,
        mateIds: groups[familyId].map((mate) => mate.id),
      }));
    await assignMatesFn({
      variables: {
        newAssignments,
      },
    });
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
            <Title level={2}>
              {isAllAssigned ? "All mates assigned!" : "Unassigned Mates"}
            </Title>
          </Col>
        </Row>
        <FamilyDroppable
          mates={groups[unassignedId] ?? []}
          direction="horizontal"
          droppableId={unassignedId}
          removeMate={removeMate}
        />
        <Divider />
        <Row wrap={false} style={{ overflow: "auto" }}>
          {Object.keys(groups)
            .filter((familyId) => familyId !== unassignedId)
            .map((familyId) => (
              <Col
                key={familyId}
                style={{ width: 220, marginLeft: 5, marginRight: 5 }}
              >
                <Row justify="center">
                  <Col>
                    <Title level={2}>{familyMap[familyId].name}</Title>
                  </Col>
                </Row>
                <FamilyDroppable
                  mates={groups[familyId] ?? []}
                  droppableId={familyId}
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
