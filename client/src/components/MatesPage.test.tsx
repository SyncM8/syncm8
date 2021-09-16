import React from "react";
import { render, screen } from "@testing-library/react";
import MatesPage from "./MatesPage";

test("renders Mates page", () => {
  render(<MatesPage />);
  const textElement = screen.getByText("Mates!");
  expect(textElement).toBeInTheDocument();
});
