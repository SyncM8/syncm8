import { render, screen } from "@testing-library/react";
import React from "react";
import { DragDropContext } from "react-beautiful-dnd";

import { NewMateType } from "../../pages/types";
import FamilyDroppable from "./FamilyDroppable";

test("renders horizontal FamilyDroppable", () => {
  const mates: NewMateType[] = [
    { name: "C. S. Lewis", lastSynced: new Date(), id: "LewisId" },
  ];
  render(
    <DragDropContext onDragEnd={() => ({})}>
      <FamilyDroppable
        mates={mates}
        family="school"
        direction="horizontal"
        removeMate={() => ({})}
      />
    </DragDropContext>
  );

  expect(screen.getByText("C. S. Lewis")).toBeInTheDocument();
});

test("renders vertical FamilyDroppable", () => {
  const mates: NewMateType[] = [
    { name: "Dorothy Sayers", lastSynced: new Date(), id: "SayersId" },
  ];
  render(
    <DragDropContext onDragEnd={() => ({})}>
      <FamilyDroppable
        mates={mates}
        family="school"
        direction="vertical"
        removeMate={() => ({})}
      />
    </DragDropContext>
  );

  expect(screen.getByText("Dorothy Sayers")).toBeInTheDocument();
});
