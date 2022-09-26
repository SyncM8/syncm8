import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createMemoryHistory } from "history";
import { stringify } from "querystring";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import { loginPath } from "../../api";
import LoginPage, { PREV_PATH_KEY } from "./RegisterPage";

const mock = new MockAdapter(axios);

afterEach(() => {
  mock.reset();
  cleanup();
});

beforeEach(() => {
  mock.onPost(loginPath).reply(200, { isLoggedIn: true });
});

test("routes to prevPath if loggedIn and prevPath, beforeLoginPath are set", async () => {
  const prevPath = "/somewhereOverTheRainbow";
  const history = createMemoryHistory();
  history.replace("/login", { prevPath });
  render(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <LoginPage loggedIn setLoggedIn={jest.fn()} />
        </Route>
      </Switch>
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toBe(prevPath));
});

test("routes to beforeLoginPath after logging in", async () => {
  const beforeLoginPath = "/somewhereOverTheRainbow";
  const state = stringify({
    [PREV_PATH_KEY]: beforeLoginPath,
  });
  const hash = stringify({
    access_token: "token123",
    state,
  });
  Object.defineProperty(window, "location", {
    writable: true,
    value: { hash: `#${hash}` },
  });
  const setLoggedIn = jest.fn();

  const history = createMemoryHistory({ initialEntries: ["/login"] });

  const { rerender } = render(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <LoginPage loggedIn={false} setLoggedIn={setLoggedIn} />
        </Route>
      </Switch>
    </Router>
  );
  await waitFor(() => expect(setLoggedIn).toHaveBeenCalledWith(true));

  // re-render to simulate prop change
  rerender(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <LoginPage loggedIn setLoggedIn={setLoggedIn} />
        </Route>
      </Switch>
    </Router>
  );

  await waitFor(() => expect(history.location.pathname).toBe(beforeLoginPath));
});

test("renders login button if not loggedIn", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {}); // suppresses the expected console.error

  const history = createMemoryHistory({ initialEntries: ["/login"] });
  render(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <LoginPage loggedIn={false} setLoggedIn={jest.fn()} />
        </Route>
      </Switch>
    </Router>
  );
  const loginBtn = screen.getByText("Login with Google");
  await waitFor(() => expect(loginBtn).toBeInTheDocument());
  fireEvent.click(loginBtn);
});
