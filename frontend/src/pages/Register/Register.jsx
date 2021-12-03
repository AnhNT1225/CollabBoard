import React, { useState } from "react";
import { Input, Button, Form, DatePicker, Select, Row, Col, message } from "antd";
import AuthService from "../../services/authService";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./styles.scss";
import NavBar from "../../components/NavBar/NavBar";
const { Option } = Select;
const Register = () => {
  const history = useHistory();
  //   const [form, setForm] = useState({});
  // const [messageError, setMessageError] = useState([]);
  // //Validate the password & confirm password is same or not
  // const validatePassword = (password, confirmPassword) => {
  //   if (password !== confirmPassword) {
  //     setMessageError((prevState) => [
  //       ...prevState,
  //       { unduplicatedError: "Password and confirm password unmatched" },
  //     ]);
  //   }
  // };

  const handleSignup = (form) => {
    console.log("form result: ", form);

    const data = {
      email: form.email,
      name: form.name,
      password: form.password,
      gender: form.gender,
      DoB: form.DoB,
    };
    AuthService.register(data)
      .then((userInfo) => {
        history.push("/dashboard");
        console.log("returned data: ", userInfo);
      })
      .catch((error) => {
        console.log("error: ", error);
        message.error('Failed! This email has been used')
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
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <label className="input_label" htmlFor="gender">
                Gender
              </label>
              <Form.Item
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Please input your gender!",
                  },
                  { whitespace: true },
                ]}
                hasFeedback
              >
                <Select placeholder="Your gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <label className="input_label" htmlFor="DoB">
                Date of Birth
              </label>
              <Form.Item
                name="DoB"
                rules={[
                  {
                    required: true,
                    message: "Please input your DoB!",
                  },
                ]}
                hasFeedback
              >
                <DatePicker
                  onChange={(date, dateString) => {
                    console.log("date: ", date, "dateString: ", dateString);
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
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
                  "Password must have at least 8 characters!",
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
                  "Password must have at least 8 characters!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log(
                    "value: ",
                    value,
                    "_: ",
                    _,
                    "getFieldValue: ",
                    getFieldValue("password")
                  );
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    "Password and confirm password unmatched!"
                  );
                },
              }),
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
            />
          </Form.Item>
          <div style={{textAlign: "center"}}>
            <Button
              className="button_form"
              type="primary"
              htmlType="submit"
              onClick={handleSignup}
              size="large"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;
