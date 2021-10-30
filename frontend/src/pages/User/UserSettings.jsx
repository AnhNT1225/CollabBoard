import React from "react";
import { Tabs, Form, Input, Button} from "antd";
import { useHistory } from "react-router-dom";
import { SafetyOutlined, BellOutlined, EditOutlined } from "@ant-design/icons";
import UserEdit from "./UserEdit";
const { TabPane } = Tabs;
const UserSettings = () => {
  const history = useHistory();
  const callback = (key) => {
    console.log(key);
  };

  const onFinish = (values) => {
    console.log("Success:", values);
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
                name="basic"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 16,
                }}
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Please input your username!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  wrapperCol={{
                    offset: 8,
                    span: 16,
                  }}
                >
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
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
