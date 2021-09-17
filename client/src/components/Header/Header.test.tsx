import { render, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import Header from "./Header";

test("renders Header", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <Header />
    </Router>
  );
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Mates")).toBeInTheDocument();
  expect(screen.getByText("Families")).toBeInTheDocument();
});
