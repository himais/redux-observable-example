import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import { configureStore } from "./configureStore";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Provider store={configureStore()}>
      <App />
    </Provider>
  </React.StrictMode>,
  rootElement
);
