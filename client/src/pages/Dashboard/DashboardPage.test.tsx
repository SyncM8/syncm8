import { render, screen } from "@testing-library/react";
import React from "react";

import DashboardPage from "./DashboardPage";

test("renders Dashboard page", () => {
  render(<DashboardPage />);
  const textElement = screen.getByText("Dashboard!");
  expect(textElement).toBeInTheDocument();
});
