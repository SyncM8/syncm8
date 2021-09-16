import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import App from "./App";

test("renders Dashboard as default", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  const dashboardElement = screen.getByText("Dashboard");
  expect(dashboardElement).toBeInTheDocument();
});

test("renders mates and families tabs", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  const matesElement = screen.getByText("Mates");
  expect(matesElement).toBeInTheDocument();

  const familiesElement = screen.getByText("Families");
  expect(familiesElement).toBeInTheDocument();
});

test("navigates to Mates page", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  const matesElement = screen.getByText("Mates");
  expect(matesElement).toBeInTheDocument();

  const leftClick = { button: 0 };
  userEvent.click(screen.getByText("Mates"), leftClick);

  const matesTitleElement = screen.getByText("Mates!");
  expect(matesTitleElement).toBeInTheDocument();
});
