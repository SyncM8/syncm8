import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import React from "react";
import { Router } from "react-router-dom";

import { name as mockName } from "../Dashboard/mockData";
import App from "./App";

const mock = new MockAdapter(axios);

beforeEach(() => {
  mock.onGet("/isLoggedIn").reply(200, { isLoggedIn: true });
});

afterEach(() => {
  mock.reset();
});

test("routes /login if not logged in", async () => {
  mock.onGet("/isLoggedIn").reply(200, { isLoggedIn: false });

  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toBe("/login"));
});

test("routes /login if network error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // suppresses the expected console.error
  mock.onGet("/isLoggedIn").reply(400);

  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toBe("/login"));
});

test("routes /login if API does not return properly formatted data", async () => {
  mock.onGet("/isLoggedIn").reply(200, { isLoggedIn: undefined });

  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toBe("/login"));
});

test("routes Dashboard if logged in", async () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toBe("/"));
  await waitFor(() =>
    expect(screen.queryByText(`Hi, ${mockName}`)).toBeInTheDocument()
  );
});

test("renders mates and families tabs", async () => {
  const history = createMemoryHistory();
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  await waitFor(() => expect(screen.queryByText("Mates")).toBeInTheDocument());
  await waitFor(() =>
    expect(screen.queryByText("Families")).toBeInTheDocument()
  );
});

test("navigates to Mates page", async () => {
  const history = createMemoryHistory();
  history.push("/mates");
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  await waitFor(() => expect(history.location.pathname).toBe("/mates"));
  await waitFor(() => expect(screen.queryByText("M8")).toBeInTheDocument());
});
