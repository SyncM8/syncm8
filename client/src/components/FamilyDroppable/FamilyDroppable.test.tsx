import { render, screen } from "@testing-library/react";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

import { mate2NoSync, mateNoSync } from "../../graphql/mock";
import { UnassignedMate } from "../../pages/types";
import FamilyDroppable from "./FamilyDroppable";

test("renders horizontal FamilyDroppable", () => {
  const mates: UnassignedMate[] = [mateNoSync, mate2NoSync];
  render(
    <DragDropContext onDragEnd={() => ({})}>
      <FamilyDroppable
        mates={mates}
        droppableId="school"
        direction="horizontal"
        removeMate={() => ({})}
      />
    </DragDropContext>
  );

  expect(screen.getByText(mateNoSync.name)).toBeInTheDocument();
  expect(screen.getByText(mate2NoSync.name)).toBeInTheDocument();
});

test("renders vertical FamilyDroppable", () => {
  const mates: UnassignedMate[] = [mateNoSync, mate2NoSync];
  render(
    <DragDropContext onDragEnd={() => ({})}>
      <FamilyDroppable
        mates={mates}
        droppableId="school"
        direction="vertical"
        removeMate={() => ({})}
      />
    </DragDropContext>
  );

  expect(screen.getByText(mateNoSync.name)).toBeInTheDocument();
  expect(screen.getByText(mate2NoSync.name)).toBeInTheDocument();
});
