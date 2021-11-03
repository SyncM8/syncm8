import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";

import {
  graphqlResFail,
  graphqlResSuccess,
  mockErrorMsg,
  newMates,
} from "./mockData";
import NewMatesPage from "./NewMatesPage";

const inputPerson = (name: string, date: string) => {
  const nameInput = screen.getByLabelText("Name");
  fireEvent.change(nameInput, { target: { value: name } });

  const dateInput = screen.getByLabelText("Last Seen");
  fireEvent.mouseDown(dateInput);
  fireEvent.change(dateInput, { target: { value: date } });
  fireEvent.click(document.querySelectorAll(".ant-picker-cell-selected")[0]);
};

test("renders NewMatesPage", () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <Router history={history}>
        <NewMatesPage />
      </Router>
    </MockedProvider>
  );

  expect(screen.getByText("Populating M8s")).toBeInTheDocument();
  expect(screen.getByText("Manual Entry")).toBeInTheDocument();
});

test("add and remove a mate card", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[]} addTypename={false}>
      <Router history={history}>
        <NewMatesPage />
      </Router>
    </MockedProvider>
  );

  const jonathan = newMates[0];

  // adding a mate card
  inputPerson(jonathan.name, "2021-09-01");
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
      expect(screen.getByText(jonathan.name)).toBeInTheDocument()
    );
  });

  // removing Edwards' mate card
  const removeMateBtn = screen.getByLabelText("delete");
  await act(async () => {
    fireEvent.click(removeMateBtn);
    await waitFor(() =>
      expect(screen.queryByText(jonathan.name)).not.toBeInTheDocument()
    );
  });
});

test("submit new mates successfully", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={graphqlResSuccess} addTypename={false}>
      <Router history={history}>
        <NewMatesPage />
      </Router>
    </MockedProvider>
  );

  const [edwards, kant] = newMates;
  // adding to submit
  const addMateBtn = screen.getByText("Add Mate");
  inputPerson(edwards.name, "2021-09-01");
  await act(async () => {
    fireEvent.click(addMateBtn);
    await waitFor(() =>
      expect(screen.getByText(edwards.name)).toBeInTheDocument()
    );
  });
  inputPerson(kant.name, "2021-09-01");
  const submitBtn = screen.getByText("Assign M8s to Families");
  await act(async () => {
    fireEvent.click(addMateBtn);
    await waitFor(() =>
      expect(screen.getByText(kant.name)).toBeInTheDocument()
    );
  });

  await act(async () => {
    fireEvent.click(submitBtn);
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    await waitFor(() => {
      expect(screen.queryByText(kant.name)).not.toBeInTheDocument();
      expect(
        screen.queryByText(`Successfully added ${newMates.length} new mates!`)
      ).toBeInTheDocument();
    });
  });
});

test("submit new mates fail", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={graphqlResFail} addTypename={false}>
      <Router history={history}>
        <NewMatesPage />
      </Router>
    </MockedProvider>
  );

  const [edwards, kant] = newMates;
  // adding to submit
  const addMateBtn = screen.getByText("Add Mate");
  inputPerson(edwards.name, "2021-09-01");
  await act(async () => {
    fireEvent.click(addMateBtn);
    await waitFor(() =>
      expect(screen.getByText(edwards.name)).toBeInTheDocument()
    );
  });
  inputPerson(kant.name, "2021-09-01");
  const submitBtn = screen.getByText("Assign M8s to Families");
  await act(async () => {
    fireEvent.click(addMateBtn);
    await waitFor(() =>
      expect(screen.getByText(kant.name)).toBeInTheDocument()
    );
  });

  await act(async () => {
    fireEvent.click(submitBtn);
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    await waitFor(() => {
      expect(screen.queryByText(kant.name)).toBeInTheDocument();
      expect(screen.queryByText(mockErrorMsg)).toBeInTheDocument();
    });
  });
});
