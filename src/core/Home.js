import React from "react";
import Books from "../book/Books";
import Main from "./Main"
import Collections from "../collection/Collections";

const Home = () => (
  <div>
      <Main />
      <Collections />
      <Books />
  </div>
);

export default Home;
