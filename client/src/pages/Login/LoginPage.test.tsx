import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";

import LoginPage from "./LoginPage";

test("routes to prevPath if loggedIn and prevPath, beforeLoginPath are set", async () => {
  const prevPath = "/somewhereOverTheRainbow";
  const history = createMemoryHistory();
  history.replace("/login", { prevPath });
  render(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <LoginPage
            loggedIn
            setLoggedIn={jest.fn()}
            beforeLoginPath="/beforeLoginPath"
            setBeforeLoginPath={jest.fn()}
          />
        </Route>
      </Switch>
    </Router>
  );
  await waitFor(() => expect(history.location.pathname).toBe(prevPath));
});

test("routes to beforeLoginPath if loggedIn and prevPath is not set", async () => {
  const beforeLoginPath = "/somewhereOverTheRainbow";
  const history = createMemoryHistory({ initialEntries: ["/login"] });
  render(
    <Router history={history}>
      <Switch>
        <Route path="/login">
          <LoginPage
            loggedIn
            setLoggedIn={jest.fn()}
            beforeLoginPath={beforeLoginPath}
            setBeforeLoginPath={jest.fn()}
          />
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
          <LoginPage
            loggedIn={false}
            setLoggedIn={jest.fn()}
            beforeLoginPath="/"
            setBeforeLoginPath={jest.fn()}
          />
        </Route>
      </Switch>
    </Router>
  );
  const loginBtn = screen.getByText("Login with Google");
  await waitFor(() => expect(loginBtn).toBeInTheDocument());
  fireEvent.click(loginBtn);
});
