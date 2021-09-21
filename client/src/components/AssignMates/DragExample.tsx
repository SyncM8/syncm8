/* eslint-disable react/jsx-props-no-spreading */
import React, { CSSProperties } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from "react-beautiful-dnd";

interface Item {
  id: string;
  content: string;
}

type StyleType = DraggingStyle | NotDraggingStyle | undefined;
type CSS = CSSProperties | undefined;

const getItems = (count: number, offset = 0): Item[] =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (draggableStyle: StyleType, isDragging: boolean): CSS => ({
  userSelect: "none",
  background: isDragging ? "lightgreen" : "grey",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  width: 250,
});

const id2List = {
  droppable: "items",
  droppable2: "selected",
};

const getKey = (id: string) => {
  if (id === "droppable") return "items";
  return "selected";
  // if (id === "droppable2") return "selected";
  // return ""
};

const move = (
  source: Item[],
  destination: Item[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {
    [getKey(droppableSource.droppableId)]: sourceClone,
    [getKey(droppableDestination.droppableId)]: destClone,
  };

  return result;
};

const App = (): JSX.Element => {
  const [state, setState] = React.useState({
    items: getItems(10),
    selected: getItems(10, 10),
  });

  const onDragEnd = (result: DropResult): void => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        state[getKey(source.droppableId)],
        source.index,
        destination.index
      );
      setState((prevState) => ({
        ...prevState,
        [getKey(destination.droppableId)]: items,
      }));
      return;
    }

    const res = move(
      state[getKey(source.droppableId)],
      state[getKey(destination.droppableId)],
      source,
      destination
    );

    setState((prevState) => ({
      ...prevState,
      ...res,
    }));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {state.items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
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
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <br />
      <Droppable droppableId="droppable2">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {state.selected.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
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
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default App;
