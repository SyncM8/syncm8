import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import MatesPage from "./MatesPage";

test("renders Mates page", () => {
  render(<MatesPage />);
  const textElement = screen.getByText("Clare Carlisle");
  expect(textElement).toBeInTheDocument();
});

test("cancel deleting card", async () => {
  render(<MatesPage />);
  const firstTitle = "Dinner at Chipotle";
  expect(screen.queryAllByText(firstTitle)).not.toHaveLength(0);
  const removeMateBtn = screen.getAllByLabelText("delete")[0];
  fireEvent.click(removeMateBtn);
  await waitFor(() => expect(screen.getByText("Delete")).toBeInTheDocument());
  await act(async () => {
    fireEvent.click(screen.getByText("No"));
    await waitForElementToBeRemoved(() =>
      screen.queryByText("This operation cannot be reversed")
    );
    await waitFor(() =>
      expect(screen.queryAllByText(firstTitle)).not.toHaveLength(0)
    );
  });
});

test("delete first sync card", async () => {
  render(<MatesPage />);
  const firstTitle = "Dinner at Chipotle";
  expect(screen.queryAllByText(firstTitle)).not.toHaveLength(0);
  const removeMateBtn = screen.getAllByLabelText("delete")[0];
  fireEvent.click(removeMateBtn);
  await waitFor(() => expect(screen.getByText("Delete")).toBeInTheDocument());
  expect(
    screen.queryByText("This operation cannot be reversed")
  ).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(screen.getByText("Delete"));
    await waitForElementToBeRemoved(() =>
      screen.queryByText("This operation cannot be reversed")
    );
    await waitFor(() =>
      expect(screen.queryAllByText(firstTitle)).toHaveLength(0)
    );
  });
});

test("renders editing modal when clicking edit", async () => {
  render(<MatesPage />);
  const editSyncBtn = screen.getAllByLabelText("edit")[0];
  expect(screen.queryByText("Title")).not.toBeInTheDocument();
  await act(async () => {
    fireEvent.click(editSyncBtn);
    await waitFor(() =>
      expect(screen.queryByText("Title")).toBeInTheDocument()
    );
  });
});

test("adds new sync", async () => {
  const unseenTitle = "Unseen";
  const unseenDetail = "I like chocolate milk?";
  const unseenDate = "2020-01-21";
  render(<MatesPage />);
  const addSyncBtn = screen.getByText("Add Sync");
  await act(async () => {
    fireEvent.click(addSyncBtn);
    await waitFor(() =>
      expect(screen.queryByText("Title")).toBeInTheDocument()
    );
    const titleInput = screen.getByPlaceholderText("New Title");
    fireEvent.change(titleInput, { target: { value: unseenTitle } });

    const detailsInput = screen.getByPlaceholderText("Add details here...");
    fireEvent.change(detailsInput, { target: { value: unseenDetail } });

    fireEvent.mouseDown(screen.getByText("COMPLETED"));
    await waitFor(() =>
      expect(screen.queryByText("DECLINED")).toBeInTheDocument()
    );
    fireEvent.click(screen.getByText("DECLINED"));

    const dateInput = screen.getByPlaceholderText("Select date");
    fireEvent.mouseDown(dateInput);
    fireEvent.change(dateInput, { target: { value: unseenDate } });
    await waitFor(() => expect(screen.queryByText("21")).toBeInTheDocument());
    fireEvent.click(screen.getByText("21"));
  });

  await act(async () => {
    const saveBtn = screen.getByText("OK");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(screen.queryAllByText(unseenTitle)).not.toHaveLength(0);
      expect(screen.queryAllByText(unseenDetail)).not.toHaveLength(0);
    });
  });
});
