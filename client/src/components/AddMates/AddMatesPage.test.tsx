import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";

import AddMatesPage from "./AddMatesPage";

test("renders AddMatesPage", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <AddMatesPage />
    </Router>
  );

  expect(screen.getByText("Populating M8s")).toBeInTheDocument();
  expect(screen.getByText("Manual Entry")).toBeInTheDocument();
});

test("add and remove a mate card", async () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <AddMatesPage />
    </Router>
  );

  const inputPerson = (name: string, date: string) => {
    const nameInput = screen.getByLabelText("Name");
    fireEvent.change(nameInput, { target: { value: name } });

    const dateInput = screen.getByLabelText("Last Seen");
    fireEvent.mouseDown(dateInput);
    fireEvent.change(dateInput, { target: { value: date } });
    fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[0]);
  };

  // adding a mate card
  inputPerson("Jonathan Edwards", "2021-09-01");
  const addMateBtn = screen.getByText("Add Mate");
  await act(async () => {
    fireEvent.click(addMateBtn);
    await waitFor(() =>
      expect(screen.getByLabelText("Name")).toBeEmptyDOMElement()
    );
    await waitFor(() =>
      expect(screen.getByLabelText("Last Seen")).toBeEmptyDOMElement()
    );
    await waitFor(() =>
      expect(screen.getByText("Jonathan Edwards")).toBeInTheDocument()
    );
  });

  // removing Alice's mate card
  const removeMateBtn = screen.getByLabelText("delete");
  await act(async () => {
    fireEvent.click(removeMateBtn);
    await waitFor(() =>
      expect(screen.queryByText("Jonathan Edwards")).not.toBeInTheDocument()
    );
  });

  // adding to submit
  inputPerson("Immanuel Kant", "2021-09-01");
  const submitBtn = screen.getByText("Assign M8s to Families");
  await act(async () => {
    fireEvent.click(addMateBtn);
    await waitFor(() =>
      expect(screen.getByText("Immanuel Kant")).toBeInTheDocument()
    );
    fireEvent.click(submitBtn);
    // await waitFor(() => expect(screen.queryByText("Immanuel Kant")).not.toBeInTheDocument());
  });
});
