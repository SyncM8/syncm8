import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import DashboardPage from "./DashboardPage";

test("renders Dashboard page", () => {
  render(<DashboardPage />);
  expect(screen.queryByText("Hi, Paul")).toBeInTheDocument();
  expect(screen.queryByText("Previous Syncs")).toBeInTheDocument();
  expect(screen.queryByText("Upcoming Syncs")).toBeInTheDocument();
});

test("remove previous sync when clicking check btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("Bartholomew")).toBeInTheDocument();
  const btn = screen.getAllByLabelText("check")[0];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText("Bartholomew")).not.toBeInTheDocument()
    );
  });
});

test("remove previous sync when clicking decline btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("Bartholomew")).toBeInTheDocument();
  const btn = screen.getAllByLabelText("close")[0];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText("Bartholomew")).not.toBeInTheDocument()
    );
  });
});

test("remove previous sync when clicking calendar btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("Bartholomew")).toBeInTheDocument();
  const btn = screen.getAllByLabelText("calendar")[0];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText("Bartholomew")).not.toBeInTheDocument()
    );
  });
});

test("remove upcoming sync when clicking carry-out btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("Judas")).toBeInTheDocument();
  const btns = screen.getAllByLabelText("carry-out");
  const btn = btns[btns.length - 1];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText("Judas")).not.toBeInTheDocument()
    );
  });
});

test("remove upcoming sync when clicking decline btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("Judas")).toBeInTheDocument();
  const btns = screen.getAllByLabelText("close");
  const btn = btns[btns.length - 1];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText("Judas")).not.toBeInTheDocument()
    );
  });
});

test("open edit summary modal when clicking edit btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("John")).toBeInTheDocument();
  expect(screen.queryByText("M8")).not.toBeInTheDocument();
  expect(screen.queryByText("Sync Date")).not.toBeInTheDocument();
  const editBtn = screen.getAllByLabelText("edit")[1];
  await act(async () => {
    fireEvent.click(editBtn);
    await waitFor(() => {
      expect(screen.queryByText("M8")).toBeInTheDocument();
      expect(screen.queryByText("Sync Date")).toBeInTheDocument();
    });
  });
});

test("open edit summary modal when clicking edit btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("John")).toBeInTheDocument();
  expect(screen.queryByText("M8")).not.toBeInTheDocument();
  const editBtn = screen.getAllByLabelText("edit")[1];
  await act(async () => {
    fireEvent.click(editBtn);
    await waitFor(() => expect(screen.queryByText("M8")).toBeInTheDocument());
  });
});

test("write title and details in edit summary modal", async () => {
  render(<DashboardPage />);
  const title = "Chipotle Meal";
  const details = "Ate 2 double chicken bowls!";

  const editBtn = screen.getAllByLabelText("edit")[1];
  await act(async () => {
    fireEvent.click(editBtn);
    await waitFor(() => expect(screen.queryByText("M8")).toBeInTheDocument());

    const titleInput = screen.getByPlaceholderText("New Title");
    fireEvent.change(titleInput, { target: { value: title } });

    const detailsInput = screen.getByPlaceholderText("Add details here...");
    fireEvent.change(detailsInput, { target: { value: details } });

    await waitFor(() => {
      expect(screen.queryByText(details)).toBeInTheDocument();
    });
  });
});

test("remove previous sync after saving edited sync", async () => {
  render(<DashboardPage />);

  expect(screen.queryByText("John")).toBeInTheDocument();
  const editBtn = screen.getAllByLabelText("edit")[1];
  await act(async () => {
    fireEvent.click(editBtn);
    await waitFor(() => expect(screen.queryByText("M8")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.queryByText("John")).not.toBeInTheDocument();
    });
  });
});
