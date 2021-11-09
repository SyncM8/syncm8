import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import { logoutPath } from "../../api";
import Header from "./Header";

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  cleanup();
});

test("renders Header", () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <Header logoutApp={jest.fn()} />
    </Router>
  );
  expect(screen.getByLabelText("search-input")).toBeInTheDocument();
  expect(screen.getByText("Dashboard")).toBeInTheDocument();
  expect(screen.getByText("Mates")).toBeInTheDocument();
  expect(screen.getByText("Families")).toBeInTheDocument();
});

test("logout user successfully", async () => {
  mock.onPost(logoutPath).reply(204);

  const history = createMemoryHistory();
  const logoutApp = jest.fn();
  render(
    <Router history={history}>
      <Header logoutApp={logoutApp} />
    </Router>
  );

  const userIcon = screen.getByLabelText("user");
  await act(async () => {
    fireEvent.click(userIcon);
    await waitFor(() => {
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });
  });

  await act(async () => {
    fireEvent.click(screen.getByText("Log Out"));

    await waitFor(() => {
      expect(logoutApp).toHaveBeenCalled();
    });
  });
});

test("logout user request failed but locally set logged out status", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // suppresses the expected console.error
  mock.onPost(logoutPath).reply(400);

  const history = createMemoryHistory();
  const logoutApp = jest.fn();
  render(
    <Router history={history}>
      <Header logoutApp={logoutApp} />
    </Router>
  );

  const userIcon = screen.getByLabelText("user");
  await act(async () => {
    fireEvent.click(userIcon);
    await waitFor(() => {
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });
  });

  await act(async () => {
    fireEvent.click(screen.getByText("Log Out"));

    await waitFor(() => {
      expect(logoutApp).toHaveBeenCalled();
    });
  });
});
