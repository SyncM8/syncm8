import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";

import { graphqlPath } from "./api";
import { Mate } from "./graphql/types";
import App from "./pages/App/App";
import reportWebVitals from "./reportWebVitals";

const client = new ApolloClient({
  uri: graphqlPath,
  cache: new InMemoryCache({
    typePolicies: {
      Family: {
        fields: {
          mates: {
            merge(existing: Mate[], incoming: Mate[]) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  credentials: "include",
});

axios.defaults.headers.common["X-Requested-With"] = "XmlHttpRequest"; // eslint-disable-line
axios.defaults.withCredentials = true;

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
