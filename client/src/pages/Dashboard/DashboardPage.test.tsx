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

// check, edit, close, calendar / carry-out, close
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

test("remove upcoming when clicking decline btn", async () => {
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
