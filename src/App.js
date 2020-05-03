import React from "react";
import { ConnectedRouter } from "react-router-dom";
import MainRouter from "./MainRouter";

const history = createHistory({
    basename: process.env.PUBLIC_URL,
  });


const App = () => (
    <ConnectedRouter history={history}>
        <MainRouter />
    </ConnectedRouter>
);

export default App;
