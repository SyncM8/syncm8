import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import FamilyPage from "./FamilyPage";

test("renders Family page", () => {
  render(<FamilyPage />);
  const textElement = screen.getByText("Family");
  expect(textElement).toBeInTheDocument();
});

test("renders confirmation when clicking delete", async () => {
  render(<FamilyPage />);
  const removeMateBtn = screen.getAllByLabelText("delete")[0];
  await act(async () => {
    fireEvent.click(removeMateBtn);
    await waitFor(() =>
      expect(
        screen.queryByText("This operation cannot be reversed")
      ).toBeInTheDocument()
    );
  });
});
