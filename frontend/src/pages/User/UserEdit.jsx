import React, { useState, useContext, useEffect } from "react";
import { Avatar, DatePicker, Input, Button, Space, Select, message} from "antd";
import moment from "moment";
import { UserContext, ACTIONS } from "../../context/userContext";
import { getUserId } from "../../lib/auth";
import UserService from "../../services/userService";
const { Option } = Select;

const UserEdit = () => {
  const userId = getUserId();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    UserService.getUserById(userId)
      .then((response) => {
        dispatch({ type: ACTIONS.GET_USER, payload: response.user });
        setNewUser(response.user);
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  // const initialValue = {
  //   email: state.user?.email,
  //   name: state.user?.name,
  //   DoB: state.user?.DoB,
  //   gender: state.user?.gender,
  //   workingPlace: state.user?.workingPlace,
  //   position: state.user?.position,
  //   avatar: state.user?.avatar,
  // };
  const [newUser, setNewUser] = useState({});
  console.log("newUser: ", newUser);
  // const handleUploadPhoto = (e) => {
  //   setNewUser({ ...newUser, avatar: e.target.files[0] });
  // };

  const submitEditInfo = async (e) => {
    e.preventDefault();
    // const formData = new FormData();
    // formData.append("name", newUser.name);
    // formData.append("email", newUser.email);
    // formData.append("DoB", newUser.DoB);
    // formData.append("gender", newUser.gender);
    // formData.append("workingPlace", newUser.workingPlace);
    // formData.append("position", newUser.position);
    // formData.append("avatar", newUser.avatar);
    await UserService.editUserInfo(newUser)
      .then((res) => {
        console.log(res.data);
        message.success('Updated user information successfully!')
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeGender = (value) => {
    setNewUser({ ...newUser, gender: value });
  };
  return (
    <div>
      <div className="user_edit_container">
        <form
          className="user_edit_form"
          onSubmit={submitEditInfo}
          // scrollToFirstError
          // autoComplete="off"
        >
          <Space direction="vertical" className="user_info_edit">
            <label>Name:</label>
              <Input
                name="name"
                value={newUser?.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            <label>Email:</label>
              <Input
                name="email"
                value={newUser?.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            <label>Gender:</label>
              <Select
                style={{width: '100%'}}
                value={newUser?.gender}
                onChange={changeGender}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                {/* <Option value="Undefined">Undefined</Option> */}
              </Select>
            <label>DoB:</label>
              <DatePicker
              style={{width: '100%'}}
                value={moment(newUser?.DoB)}
                onChange={(date, dateString) => {
                  console.log("date: ", date, "dateString: ", dateString);
                  setNewUser({ ...newUser, DoB: date });
                }}
              />
            <label>Working place:</label>
            <Input
              title=""
              value={newUser?.workingPlace ? newUser?.workingPlace : null}
              onChange={(e) =>
                setNewUser({ ...newUser, workingPlace: e.target.value })
              }
            />
            <label>Position:</label>
            <Input
              title=""
              value={newUser?.position ? newUser?.position : null}
              onChange={(e) =>
                setNewUser({ ...newUser, position: e.target.value })
              }
            />
            <div style={{textAlign:'center'}}>
            <Button htmlType="submit" type="primary" shape="round" >
              Save changes
            </Button>
            </div>
          </Space>
          {/* <Space direction="vertical" className="user_media_settings"> */}
            {/* <label>Your photo</label>
            {!newUser?.avatar ? (
              <Avatar
                className="user_avatar_edit"
                style={{ verticalAlign: "middle" }}
                size={150}
                onClick={(e) => e.preventDefault()}
              >
                <span className="avatar_digit">{newUser?.name.charAt(0)}</span>
              </Avatar>
            ) : (
              <Avatar
                className="user_avatar_edit"
                style={{ verticalAlign: "middle" }}
                size={150}
                shape="square"
                src={`${process.env.REACT_APP_SERVER_URL}/${newUser.avatar}`}
                onClick={(e) => e.preventDefault()}
              />
            )} */}

            {/* <div className="media_settings_action">
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                name="photo"
                onChange={handleUploadPhoto}
              />
              <Button>Remove</Button>
            </div> */}
            {/* <Button htmlType="submit" type="primary" shape="round">
              Save changes
            </Button> */}
          {/* </Space> */}
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
