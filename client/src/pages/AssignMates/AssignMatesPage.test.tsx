import { MockedProvider } from "@apollo/client/testing";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";

import {
  familyOneMate,
  mateNoSync,
  userTwoUnassignedMates,
} from "../../graphql/mock";
import AssignMatesPage from "./AssignMatesPage";
import {
  gqlResAssignFail,
  gqlResNoUnassigned,
  gqlResQueryFail,
  gqlResSubmitAssignment,
  gqlResTwoUnassigned,
  mockAssignErrorMsg,
  mockQueryErrorMsg,
} from "./mockData";

test("renders AssignMatesPage page", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[gqlResNoUnassigned]} addTypename={false}>
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );
  expect(screen.getByText("Assigning M8s")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText("All mates assigned!")).toBeInTheDocument();
    expect(screen.queryByText("Unassigned Mates")).not.toBeInTheDocument();
  });
});

test("renders with unassigned mates", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[gqlResTwoUnassigned]} addTypename={false}>
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );
  expect(screen.getByText("Assigning M8s")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText("Unassigned Mates")).toBeInTheDocument();
    expect(screen.queryByText("All mates assigned!")).not.toBeInTheDocument();
    expect(screen.getByText(mateNoSync.name)).toBeInTheDocument();
  });
});

test("removes a mate card", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[gqlResTwoUnassigned]} addTypename={false}>
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );

  await waitFor(() => {
    expect(screen.getByText(mateNoSync.name)).toBeInTheDocument();
  });

  const removeMateBtns = screen.getAllByLabelText("delete");
  const matesLength = removeMateBtns.length;
  await act(async () => {
    fireEvent.click(removeMateBtns[0]);
    await waitFor(() =>
      expect(screen.getAllByLabelText("delete")).toHaveLength(matesLength - 1)
    );
  });
});

test("move card to another family", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[gqlResTwoUnassigned]} addTypename={false}>
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );

  const mateName = mateNoSync.name;
  const anotherFamily = familyOneMate.name;

  await waitFor(() => {
    expect(screen.getByText(mateName)).toBeInTheDocument();
    expect(screen.getByText(anotherFamily)).toBeInTheDocument();
  });

  const mateCard = screen.getByText(mateName);
  const familyDrop = screen.getByText(anotherFamily);

  fireEvent.dragStart(mateCard);
  fireEvent.dragOver(familyDrop);
  fireEvent.dragEnter(familyDrop);
  fireEvent.drop(mateCard);
  fireEvent.dragEnd(familyDrop);
});

test("submits assigned mates", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider
      mocks={[gqlResTwoUnassigned, gqlResSubmitAssignment, gqlResNoUnassigned]}
      addTypename={false}
    >
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );
  expect(screen.getByText("Assigning M8s")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText("Unassigned Mates")).toBeInTheDocument();
    expect(screen.queryByText("All mates assigned!")).not.toBeInTheDocument();
    expect(screen.getByText(mateNoSync.name)).toBeInTheDocument();
  });

  const numAssignedMates =
    userTwoUnassignedMates.unassigned_family.mates.length;
  const submitBtn = screen.getByText("Save family assignments");
  await act(async () => {
    fireEvent.click(submitBtn);
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    await waitFor(() => {
      expect(
        screen.getByText(`Assigned ${numAssignedMates} mates!`)
      ).toBeInTheDocument();
      expect(screen.getByText("All mates assigned!")).toBeInTheDocument();
      expect(screen.queryByText(mateNoSync.name)).not.toBeInTheDocument();
    });
  });
});

test("unassigned query fail", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider mocks={[gqlResQueryFail]} addTypename={false}>
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );
  expect(screen.getByText("Assigning M8s")).toBeInTheDocument();
  await waitFor(() => {});

  await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
  await waitFor(() => {
    expect(screen.queryByText(mockQueryErrorMsg)).toBeInTheDocument();
  });
});

test("submits assigned mates fail", async () => {
  const history = createMemoryHistory();
  render(
    <MockedProvider
      mocks={[gqlResTwoUnassigned, gqlResAssignFail]}
      addTypename={false}
    >
      <Router history={history}>
        <AssignMatesPage />
      </Router>
    </MockedProvider>
  );
  expect(screen.getByText("Assigning M8s")).toBeInTheDocument();
  await waitFor(() => {
    expect(screen.getByText("Unassigned Mates")).toBeInTheDocument();
    expect(screen.queryByText("All mates assigned!")).not.toBeInTheDocument();
    expect(screen.getByText(mateNoSync.name)).toBeInTheDocument();
  });

  const submitBtn = screen.getByText("Save family assignments");
  await act(async () => {
    fireEvent.click(submitBtn);
    await new Promise((resolve) => setTimeout(resolve, 0)); // wait for response
    await waitFor(() => {
      expect(screen.queryByText(mockAssignErrorMsg)).toBeInTheDocument();
    });
  });
});
