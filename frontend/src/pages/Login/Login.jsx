import React, {  useContext } from "react";
import { Link, withRouter, useHistory } from "react-router-dom";
import { Input, Button, Divider, message, Form } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
  CloseOutlined,
} from "@ant-design/icons";
// import { useGoogleLogin } from "react-google-login";
import Logo from "../../components/Logo";
import GoogleLogin from "react-google-login";
// import { refreshTokenSetup } from "../../utils/refreshToken";
import AuthService from "../../services/authService";
import { ACTIONS, UserContext } from "../../context/userContext";

import "./styles.scss";
const Login = (props) => {
  const { dispatch } = useContext(UserContext);
  const history = useHistory();

  //use for checking validate form
  const handleLogin = (data) => {
    // setIsLoading(true);
    AuthService.login(data)
      .then((data) => {
        dispatch({ type: ACTIONS.LOGIN, payload: data });
        // console.log("data.user: ", data.user.role);
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("name", data.user.name);
        message.success(`Login successfully`, 1);
        if (data.user.role === "admin") {
          props.history.push("/admin");
        } else {
          props.history.push("/dashboard");
          props.setupSocket();
        }
      })
      .catch((error) => {
        console.log("error: ", error);
        // setIsLoading(false);
        message.error(
          `Your account is wrong or not existed! Please login again.`
        );
      });
  };

  const handleGoogleLogin = async (googleData) => {
    console.log("google data: ", googleData);
    try {
      if (googleData) {
        const token = googleData.code;
        console.log("Google data: ", token);
        await AuthService.loginWithGoogle(token).then((data) => {
          console.log("login data GOOGLE: ", data);
          dispatch({ type: ACTIONS.LOGIN, payload: data });
          // console.log("data.user: ", data.user.role);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("name", data.user.name);
          message.success(`Login successfully`, 1);
          if (data.user.role === "admin") {
            console.log('fault')
            props.history.push("/admin");
          } 
          else {
            console.log('props: ', props.history)
            props.history.replace("/dashboard");
            props.setupSocket();
          }
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <div className="login">
      <div className="login_wrap">
        <Link to={"/"}>
          <Button
            className="close_btn"
            type="text"
            icon={<CloseOutlined style={{ fontSize: 20 }} />}
          />
        </Link>
        <Form className="login_form" onFinish={handleLogin} scrollToFirstError autoComplete="off">
          {/* <form className="login_form"   onSubmit={handleLogin}> */}
          <Logo />
          <label className="input_label" htmlFor="email">
            Email
          </label>
          <Form.Item
            name="email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid email!',
              },
              {
                required: true,
                message: 'Please input your email!',
              },
              {whitespace: true},
              {max: 50, message: 'The maximum charecters of email is 50 charecters!'}
            ]}
            hasFeedback
          >
            <Input
              className="login_input"
              size="middle"
              type="text"
              placeholder="abc@xyz.com"
              prefix={<UserOutlined />}
              // allowClear
            />
          </Form.Item>
          <label className="input_label" htmlFor="password">
            Password
          </label>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {min: 8, message:"Password must have at least 8 characters"}
            ]}
            hasFeedback
          >  
          <Input.Password
            className="login_input"
            name="password"
            size="middle"
            placeholder="Enter at least 8 characters"
            prefix={<LockOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          </Form.Item>
          <div className="forgot_section">
            <Link className="redirect_link" to={"/reset-password"}>
              Forgot password?
            </Link>
          </div>
          <br />
          <button className="login_btn" type="submit">
            <span>Log In</span>
          </button>
          <Divider plain>or continue with</Divider>
          <div className="third_party_login">
            <GoogleLogin
              clientId={process.env.REACT_APP_CLIENT_ID}
              buttonText="Log in with Google"
              responseType="code"
              /**
               * To get access_token and refresh_token in server side,
               * the data for redirect_uri should be postmessage.
               * postmessage is magic value for redirect_uri to get credentials without actual redirect uri.
               */
              redirectUri="postmessage"
              onSuccess={handleGoogleLogin}
              onFailure={handleGoogleLogin}
              cookiePolicy={"single_host_origin"}
            />
          </div>
          <div className="signal_wrap">
            <p>
              Don't have an account?{" "}
              <Link className="redirect_link" to={"/register"}>
                Signup
              </Link>
            </p>
          </div>
          {/* </form> */}
        </Form>
      </div>
    </div>
  );
};

export default withRouter(Login);
