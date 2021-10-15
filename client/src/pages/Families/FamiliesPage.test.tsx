import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import FamiliesPage from "./FamiliesPages";

test("renders Family page", () => {
  render(<FamiliesPage />);
  const textElement = screen.getByText("Family");
  expect(textElement).toBeInTheDocument();
});

test("renders confirmation when clicking delete", async () => {
  render(<FamiliesPage />);
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
