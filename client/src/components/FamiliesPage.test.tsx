import React from "react";
import { render, screen } from "@testing-library/react";
import FamiliesPage from "./FamiliesPages";

test("renders Dashboard page", () => {
  render(<FamiliesPage />);
  const textElement = screen.getByText("Families!");
  expect(textElement).toBeInTheDocument();
});
