/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties } from "react";
import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";

import { NewMateType } from "../../pages/types";
import NewMatesCard from "../NewMateCard/NewMateCard";

const CARD_WIDTH = 200;
const GRID = 8;
const DROP_MIN_HEIGHT = 125;

type StyleType = DraggingStyle | NotDraggingStyle | undefined;
type CSSType = CSSProperties | undefined;

type FamilyDroppableType = {
  mates: NewMateType[];
  direction: "horizontal" | "vertical";
  family: string;
  removeMate: (mate: NewMateType) => void;
};

/**
 * CSS style for horizontal grid item
 * @param draggableStyle
 * @param isDragging
 * @returns CSSProperties
 */
const horizontalGetItemStyle = (
  draggableStyle: StyleType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDragging: boolean
): CSSType => ({
  userSelect: "none",
  margin: `0 ${GRID}px 0 0`,
  ...draggableStyle,
});

/**
 * CSS style for horizontal grid list
 * @param isDraggingOver
 * @returns CSSProperties
 */
const horizontalGetListStyle = (isDraggingOver: boolean): CSSType => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  display: "flex",
  padding: GRID,
  overflow: "auto",
  minHeight: DROP_MIN_HEIGHT,
});

/**
 * CSS style for vertical grid item
 * @param draggableStyle
 * @param isDragging
 * @returns CSSProperties
 */
const verticalGetItemStyle = (
  draggableStyle: StyleType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isDragging: boolean
): CSSType => ({
  userSelect: "none",
  margin: `0 auto ${GRID}px auto`,
  width: CARD_WIDTH,
  ...draggableStyle,
});

/**
 * CSS style for vertical grid list
 * @param isDraggingOver
 * @returns CSSProperties
 */
const verticalGetListStyle = (isDraggingOver: boolean): CSSType => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: GRID,
  width: 220,
  minHeight: DROP_MIN_HEIGHT,
  borderRadius: 5,
});

/**
 * Droppable area for drag-and-drop items
 * @param CustomDroppableProps
 * @returns
 */
const FamilyDroppable = ({
  mates,
  family,
  direction,
  removeMate,
}: FamilyDroppableType): JSX.Element => {
  const getListStyle =
    direction === "vertical" ? verticalGetListStyle : horizontalGetListStyle;
  const getItemStyle =
    direction === "vertical" ? verticalGetItemStyle : horizontalGetItemStyle;
  return (
    <Droppable droppableId={family} direction={direction}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          style={getListStyle(snapshot.isDraggingOver)}
        >
          {mates.map((item, index) => (
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
                    style={{ width: CARD_WIDTH }}
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
  );
};

export default FamilyDroppable;
