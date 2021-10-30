import React, { Suspense } from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import HomePage from "./pages/HomePage/index.jsx";
import Register from "./pages/Register/index";
import Editor from "./pages/Editor/index";
import Login from "./pages/Login/index";
// import NotFound from "./pages/PageNotFound";
import UserProfile from "./pages/User/UserProfile";
import OwnerProfile from "./pages/User/OwnerProfile";
import AdminPage from "./pages/AdminPage/index";

import AboutUs from "./pages/About us/index";
import Spinner from "./components/Loading/Spinner";
import ForgotPassword from "./pages/RecoveryPassword/ForgotPassword";
import ResetPassword from "./pages/RecoveryPassword/ForgotPassword";
// import { PrivateRoute } from "./components/PrivateRoute";
// import UserDashboard from "./pages/Dashboard/UserDashboard";
// import Overview from "./pages/AdminPage/Overview";
import TeamResult from "./components/Tab/TeamTab/TeamResult";
import UserSettings from "./pages/User/UserSettings";


const UserDashboard = React.lazy(() =>
  import("./pages/Dashboard/UserDashboard")
);

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Router>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={AdminPage} />
          {/* <PrivateRoute
            path="/admin"
            roles={[Role.Admin]}
            component={AdminPage}
          /> 
           <PrivateRoute
            path="/dashboard"
            roles={[Role.User]}
            component={UserDashboard}
          />  */}
          <Route exact path="/user/profiles" component={OwnerProfile} />
          <Route path="/user/settings" component={UserSettings} />
          <Route path="/user/:id" component={UserProfile} />
          
          <Route path="/about" component={AboutUs} />
          <Route path="/reset-password" component={ForgotPassword} />
          <Route path="/reset-password/:token" component={ResetPassword} />
          <Route
            path="/dashboard"
            render={() => {
              return localStorage.getItem("token") ? (
                <UserDashboard />
              ) : (
                <Redirect to="/login" />
              );
            }}
          />
          {/* <Route exact path="/admin"
						render={() => {
							return localStorage.getItem("token") ? (
								<AdminPage />
							) : (
								<Redirect to="/login" />
							);
						}} /> */}
          {/* <Route exact path="/admin/overview" component={Overview} /> */}
          <Route path="/teams/:id" component={TeamResult} />
          <Route path="/board/:id" component={Editor} />

          <Route exact path="/" component={HomePage} />
          {/* <Route path="*" component={NotFound} /> */}
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
