import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { act } from "react-dom/test-utils";

import MatesPage from "./MatesPage";
import { mockData } from "./mockData";

test("renders Mates page", () => {
  render(<MatesPage />);
  const textElement = screen.getByText("Next Planned Sync Date");
  expect(textElement).toBeInTheDocument();
});

test("sorts columns", async () => {
  render(<MatesPage />);
  const mateColumn = screen.getByText("Mate");

  const names = mockData.map((data) => data.mate.name);
  // default sorted order
  const els = screen.getAllByText("no sync", { exact: false });
  expect(els.length).toBe(mockData.length);
  expect(els[0]).toHaveTextContent(names[0]);
  expect(els[1]).toHaveTextContent(names[1]);
  expect(els[2]).toHaveTextContent(names[2]);

  // ascending order
  names.sort();
  await act(async () => {
    fireEvent.click(mateColumn);
    await waitFor(() => ({}));
    const sortedEls = screen.getAllByText("no sync", { exact: false });
    expect(sortedEls[0]).toHaveTextContent(names[0]);
    expect(sortedEls[1]).toHaveTextContent(names[1]);
    expect(sortedEls[2]).toHaveTextContent(names[2]);
  });

  // descending order
  names.sort((a, b) => b.localeCompare(a));
  await act(async () => {
    fireEvent.click(mateColumn);
    await waitFor(() => ({}));
    const sortedEls = screen.getAllByText("no sync", { exact: false });
    expect(sortedEls[0]).toHaveTextContent(names[0]);
    expect(sortedEls[1]).toHaveTextContent(names[1]);
    expect(sortedEls[2]).toHaveTextContent(names[2]);
  });
});
