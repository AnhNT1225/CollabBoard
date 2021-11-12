import React, {useContext} from "react";
import { Tabs, Form, Input, Button, message } from "antd";
import { useHistory } from "react-router-dom";
import {
  SafetyOutlined,
  BellOutlined,
  EditOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import UserEdit from "./UserEdit";
import UserService from "../../services/userService";
import { UserContext } from "../../context/userContext";
const { TabPane } = Tabs;
const UserSettings = () => {
  const history = useHistory();
  const {dispatch} = useContext(UserContext);

  const callback = (key) => {
    console.log(key);
  };

  const handleChangePassword = (values) => {
    console.log("Success:", values);
    UserService
      .changePassword(values.password)
      .then((result) => {
        console.log("change password succesful: ", result);
        message.success('Successfully change the password!')
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div className="page_header">
        <button className="back_btn" onClick={() => history.goBack(1)}>
          <i id="back_icon" className="fas fa-chevron-left"></i>
        </button>
        <h2 className="page_title">User Settings</h2>
      </div>
      <div className="user_settings_container">
        {/* <div className="user_settings content"> */}
        <Tabs onChange={callback} type="card" centered>
          <TabPane
            tab={
              <span>
                <EditOutlined style={{ fontSize: 25 }} />
                Edit Profile
              </span>
            }
            key="1"
          >
            <UserEdit />
          </TabPane>
          <TabPane
            tab={
              <span>
                <SafetyOutlined style={{ fontSize: 25 }} />
                Security
              </span>
            }
            key="2"
          >
            <Form
              className="register_form"
              onFinish={handleChangePassword}
              onFinishFailed={onFinishFailed}
              scrollToFirstError
              autoComplete="off"
            >
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
              <Button
                className="button_form"
                type="primary"
                htmlType="submit"
                size="large"
              >
                Submit
              </Button>
            </Form>
          </TabPane>
          <TabPane
            tab={
              <span>
                <BellOutlined style={{ fontSize: 22 }} />
                Notifications
              </span>
            }
          ></TabPane>
        </Tabs>
        {/* </div> */}
      </div>
    </>
  );
};

export default UserSettings;
