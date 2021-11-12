import React, { useState } from "react";
import { Input, Button, Form } from "antd";
import AuthService from "../../services/authService";
import { useHistory } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./styles.scss";
import NavBar from "../../components/NavBar/NavBar";

const Register = () => {
  const history = useHistory();
//   const [form, setForm] = useState({});
  const [messageError, setMessageError] = useState([]);
  //Validate the password & confirm password is same or not
  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setMessageError((prevState) => [
        ...prevState,
        { unduplicatedError: "Password and confirm password unmatched" },
      ]);
    }
  };

  const handleSignup = (form) => {
    console.log("form result: ", form);

    const data = {
      email: form.email,
      name: form.name,
      password: form.password,
    };
    AuthService.register(data)
      .then((userInfo) => {
        history.push("/dashboard");
        console.log("returned data: ", userInfo);
      })
      .catch((error) => {
        console.log("error: ", error);
        // setIsLoading(false);
      });
    // setForm({});
  };
//   console.log("form: ", form);
  return (
    <div className="login">
      <NavBar />
      <div className="register_wrap">
        <Form
          className="register_form"
          onFinish={handleSignup}
          scrollToFirstError
          autoComplete="off"
        >
          <h2 className="title_form">Create an account</h2>
          <label className="input_label" htmlFor="name">
            Full Name
          </label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input
              className="register_input"
              size="middle"
              placeholder="Name"
              name="name"
            />
          </Form.Item>
          <label className="input_label" htmlFor="email">
            Email
          </label>
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input
              className="register_input"
              size="middle"
              placeholder="Email"
              name="email"
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
			  {
				min: 8,
				message:
				  "Your password must have at least 8 characters for secure!",
			  },
            ]}
            hasFeedback
          > 
          <Input.Password
            className="register_input"
            placeholder="Type password"
            name="password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
		  </Form.Item>
          <label className="input_label" htmlFor="confirm_password">
            Confirm password
          </label>
		  <Form.Item
            name="confirm_password"
			dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
			  {
				min: 8,
				message:
				  "Your password must have at least 8 characters for secure!",
			  },
			  ({ getFieldValue}) => ({
				  validator(_, value){
					  console.log('value: ', value, "_: ", _, "getFieldValue: ", getFieldValue("password"))
					  if(!value || getFieldValue("password") === value){
						  return Promise.resolve();
					  }
					  return Promise.reject("Password and confirm password unmatched!")
				  }
			  })
            ]}
            hasFeedback
          > 
          <Input.Password
            className="register_input"
            placeholder="Confirm pasword"
            name="confirm_password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            // onChange={(e) =>
            //   setForm((prevState) =>
            //     setForm({
            //       ...prevState,
            //       confirmPassword: e.target.value,
            //     })
            //   )
            // }
          />
		</Form.Item>
          <Button
            className="button_form"
            type="primary"
            htmlType="submit"
            onClick={handleSignup}
            size="large"
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
