import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import DashboardPage, { splitPreviousUpcomingSyncs } from "./DashboardPage";
import { initialSyncs, name, today } from "./mockData";

const [previousSyncs, upcomingSyncs] = splitPreviousUpcomingSyncs(
  initialSyncs,
  today
);

test("splits correctly splitPreviousUpcomingSyncs", () => {
  const [previous, upcoming] = splitPreviousUpcomingSyncs(initialSyncs, today);
  expect(previous.length).toEqual(
    initialSyncs.filter((sync) => sync.upcomingSync < today).length
  );
  expect(upcoming.length).toEqual(
    initialSyncs.filter((sync) => sync.upcomingSync > today).length
  );
});

test("renders Dashboard page", () => {
  render(<DashboardPage />);
  expect(screen.queryByText(`Hi, ${name}`)).toBeInTheDocument();
  expect(screen.queryByText("Previous Syncs")).toBeInTheDocument();
  expect(screen.queryByText("Upcoming Syncs")).toBeInTheDocument();
});

test("remove previous sync when clicking check btn", async () => {
  render(<DashboardPage />);
  const idx = 0;
  const testName = previousSyncs[idx].name;
  expect(screen.queryByText(testName)).toBeInTheDocument();
  const btn = screen.getAllByLabelText("check")[idx];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText(testName)).not.toBeInTheDocument()
    );
  });
});

test("remove previous sync when clicking decline btn", async () => {
  render(<DashboardPage />);

  const idx = 0;
  const testName = previousSyncs[idx].name;
  expect(screen.queryByText(testName)).toBeInTheDocument();
  const btn = screen.getAllByLabelText("close")[idx];
  await act(async () => {
    fireEvent.click(btn);
    await waitFor(() =>
      expect(screen.queryByText(testName)).not.toBeInTheDocument()
    );
  });
});

test("remove upcoming sync when clicking carry-out btn", async () => {
  render(<DashboardPage />);

  const idx = upcomingSyncs.length - 1;
  const testName = upcomingSyncs[idx].name;
  expect(screen.queryByText(testName)).toBeInTheDocument();
  const btns = screen.getAllByLabelText("carry-out");
  await act(async () => {
    fireEvent.click(btns[btns.length - 1]);
    await waitFor(() =>
      expect(screen.queryByText(testName)).not.toBeInTheDocument()
    );
  });
});

test("remove upcoming sync when clicking decline btn", async () => {
  render(<DashboardPage />);

  const idx = upcomingSyncs.length - 1;
  const testName = upcomingSyncs[idx].name;
  expect(screen.queryByText(testName)).toBeInTheDocument();
  const btns = screen.getAllByLabelText("close");
  await act(async () => {
    fireEvent.click(btns[btns.length - 1]);
    await waitFor(() =>
      expect(screen.queryByText(testName)).not.toBeInTheDocument()
    );
  });
});

/* Summary Modal */
test("open edit summary modal when clicking edit btn", async () => {
  render(<DashboardPage />);

  expect(screen.queryByText("M8")).not.toBeInTheDocument();
  expect(screen.queryByText("Sync Date")).not.toBeInTheDocument();
  expect(screen.queryByText("Title")).not.toBeInTheDocument();
  expect(screen.queryByText("Details")).not.toBeInTheDocument();
  expect(screen.queryByText("Reschedule")).not.toBeInTheDocument();
  const editBtn = screen.getAllByLabelText("edit")[0];
  await act(async () => {
    fireEvent.click(editBtn);
    await waitFor(() => {
      expect(screen.queryByText("M8")).toBeInTheDocument();
      expect(screen.queryByText("Sync Date")).toBeInTheDocument();
      expect(screen.queryByText("Title")).toBeInTheDocument();
      expect(screen.queryByText("Details")).toBeInTheDocument();
      expect(screen.queryByText("Reschedule")).not.toBeInTheDocument();
    });
  });
});

test("write title and details in edit summary modal", async () => {
  render(<DashboardPage />);
  const title = "Test Title";
  const details = "Test description here";

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

  const idx = 1;
  const testName = previousSyncs[idx].name;
  expect(screen.queryByText(testName)).toBeInTheDocument();
  const editBtn = screen.getAllByLabelText("edit")[idx];
  await act(async () => {
    fireEvent.click(editBtn);
    await waitFor(() => expect(screen.queryByText("M8")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => {
      expect(screen.queryByText(testName)).not.toBeInTheDocument();
    });
  });
});

/* Reschedule Modal */
test("open edit reschedule modal when clicking calendar btn", async () => {
  render(<DashboardPage />);
  expect(screen.queryByText("M8")).not.toBeInTheDocument();
  expect(screen.queryByText("Sync Date")).not.toBeInTheDocument();
  expect(screen.queryByText("Title")).not.toBeInTheDocument();
  expect(screen.queryByText("Details")).not.toBeInTheDocument();
  expect(screen.queryByText("Reschedule")).not.toBeInTheDocument();
  const calendarBtn = screen.getAllByLabelText("calendar")[1];
  await act(async () => {
    fireEvent.click(calendarBtn);
    await waitFor(() => {
      expect(screen.queryByText("M8")).toBeInTheDocument();
      expect(screen.queryByText("Sync Date")).toBeInTheDocument();
      expect(screen.queryByText("Title")).not.toBeInTheDocument();
      expect(screen.queryByText("Details")).not.toBeInTheDocument();
      expect(screen.queryByText("Reschedule")).toBeInTheDocument();
    });
  });
});
