import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import NavBar from './core/NavbarPage';
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Profile from "./user/Profile";
import Users from "./user/Users";
import EditProfile from "./user/EditProfile";
import FindPeople from "./user/FindPeople";
import NewCollection from "./collection/NewCollection";
import EditCollection from "./collection/EditCollection";
import SingleCollection from "./collection/SingleCollection";
import NewBook from "./book/NewBook";
import EditBook from "./book/EditBook";
import SingleBook from "./book/SingleBook";
import BooksFull from "./book/BooksFull"
import PrivateRoute from "./auth/PrivateRoute";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Finder from "./core/Finder";
import Admin from "./admin/Admin";
import { AuthContext } from "../context/AuthContext";


const MainRouter = () => (
    <div>
        <NavBar />
        <Switch>
            <Route exact path="/" component={Home} />
            <PrivateRoute exact path="/admin" component={Admin} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route
                exact
                path="/reset-password/:resetPasswordToken"
                component={ResetPassword}
            />
            <PrivateRoute exact path="/collection/create" component={NewCollection} />
            <Route exact path="/collection/:collectionId" component={SingleCollection} />
            <PrivateRoute
                exact
                path="/collection/edit/:collectionId"
                component={EditCollection}
            />
             <PrivateRoute exact path="/book/create" component={NewBook} />
             <Route exact path="/books" component={BooksFull} />
            <Route exact path="/book/:bookId" component={SingleBook} />
            <PrivateRoute
                exact
                path="/book/edit/:bookId"
                component={EditBook}
            />
            <Route exact path="/users" component={Users} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/signin" component={Signin} />
            <PrivateRoute
                exact
                path="/user/edit/:userId"
                component={EditProfile}
            />
            <PrivateRoute exact path="/findpeople" component={FindPeople} />
            <PrivateRoute exact path="/user/:userId" component={Profile} />
            <PrivateRoute exact path="/finder" component={Finder} />
        </Switch>
    </div>
);

export default MainRouter;
