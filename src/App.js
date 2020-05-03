import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./MainRouter";
import { BrowserRouter as Router } from 'react-router-dom';


const App = () => (
    <BrowserRouter>
        <MainRouter />
    </BrowserRouter>
);

export default App;
