import React, { Suspense, useState, useEffect } from "react";
import "./App.css";
import "antd/dist/antd.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage/Homepage";
import Register from "./pages/Register/Register";
import Editor from "./pages/Editor/Editor";
import Login from "./pages/Login/Login";
// import NotFound from "./pages/PageNotFound";
import UserProfile from "./pages/User/UserProfile";
import OwnerProfile from "./pages/User/OwnerProfile";
import AdminPage from "./pages/AdminDashboard/AdminDashboard";

import AboutUs from "./pages/About us/index";
import Spinner from "./components/Loading/Spinner";
import ForgotPassword from "./pages/RecoveryPassword/ForgotPassword";
import ResetPassword from "./pages/RecoveryPassword/ForgotPassword";
// import { PrivateRoute } from "./components/PrivateRoute";
// import Overview from "./pages/AdminPage/Overview";
import TeamResult from "./components/Tab/TeamTab/TeamResult";
import UserSettings from "./pages/User/UserSettings";
import { getToken } from "./lib/auth";
import { message } from "antd";

const UserDashboard = React.lazy(() =>
  import("./pages/Dashboard/UserDashboard")
);

function App() {
  const [socket, setSocket] = useState(null);
  const setupSocket = () => {
    const token = getToken();
    if (token?.length > 0 && !socket) {
      const newSocket = io(process.env.REACT_APP_SERVER_URL, {
        forceNew: true,
        auth: {
          token: token,
        },
      });

      newSocket.on("disconnect", () => {
        setSocket(null);
        setTimeout(setupSocket, 3000);
        message.error("Socket Disconnected!")
      });

      newSocket.on("connect", () => {
        message.success("Socket Connected")
      });

      setSocket(newSocket);
    }
  };

  useEffect(() => {
    setupSocket();
  }, []);
  return (
    <Suspense fallback={<Spinner />}>
      <Router>
        <Switch>
          <Route path="/register" component={Register} />
          <Route path="/login" render={() => <Login setupSocket={setupSocket}/>} exact/>
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
                <UserDashboard socket={socket}/>
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
          <Route path="/board/:id" render={() => <Editor socket={socket}/>}  />

          <Route exact path="/" render={() => <HomePage socket={socket}/>}  />
          {/* <Route path="*" component={NotFound} /> */}
        </Switch>
      </Router>
    </Suspense>
  );
}

export default App;
