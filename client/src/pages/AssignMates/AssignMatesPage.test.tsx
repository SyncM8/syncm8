import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";

import AssignMatesPage from "./AssignMatesPage";

test("renders AssignMatesPage page", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <AssignMatesPage />
    </Router>
  );
  const textElement = screen.getByText("Assigning M8s");
  expect(textElement).toBeInTheDocument();
});

test("removes a mate card", async () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <AssignMatesPage />
    </Router>
  );

  const removeMateBtns = screen.getAllByLabelText("delete");
  const matesLength = removeMateBtns.length;
  await act(async () => {
    fireEvent.click(removeMateBtns[0]);
    await waitFor(() =>
      expect(screen.getAllByLabelText("delete")).toHaveLength(matesLength - 1)
    );
  });
});
