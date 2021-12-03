import React, { useState, useRef, useContext } from "react";
import { message, Modal, Input, Button, Form } from "antd";
import AllTeamTab from "../../components/Tab/TeamTab/AllTeamTab";
import TeamService from "../../services/teamService";
import { TeamContext } from "../../context/teamContext";
import "./styles.scss";

function Teams(props) {
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const { teamDispatch } = useContext(TeamContext);
  // const [teamName, setTeamName] = useState(null);

  // const changeTeamName = (e) => {
  // 	const name = e.target.value;
  // 	console.log("space name: ", name);
  // 	setTeamName(name);
  // };
  const createNewTeam = async (form) => {
    // e.preventDefault();
    await TeamService.createTeam(form.teamName)
      .then((result) => {
        console.log("result: ", result);
        teamDispatch({ type: "CREATE_TEAM", payload: result.data });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
        message.error("The team name has been used before!");
      });
    // await setTeamName(null);
    setCreateTeamModal(false);
  };

  return (
    <div className="space_content_wrap">
      <div className="content_header">
        <h1 className="title">Team</h1>
        <button className="create_btn" onClick={() => setCreateTeamModal(true)}>
          + Add team
        </button>
      </div>
      <Modal
        title="Create new team"
        // bodyStyle={{ padding: "2rem", height: 300 }}
        style={{ textAlign: "center" }}
        centered
        visible={createTeamModal}
        onOk={() => setCreateTeamModal(false)}
        onCancel={() => setCreateTeamModal(false)}
        footer={null}
        keyboard
		destroyOnClose={true}
      >
        <Form
          className="create_team_wrapper"
          onFinish={createNewTeam}
          scrollToFirstError
          autoComplete="off"
        >
          {/* <form className="create_team_wrapper" onSubmit={createNewTeam}> */}
          <label className="create_team_label">Team name</label>
          <br />
          <Form.Item
            name="teamName"
            rules={[
              {
                required: true,
                message: "Please input team name!",
              },
              { whitespace: true, message: "Please enter some characters!" },
            ]}
            hasFeedback
          >
            <Input
              style={{ width: 250, height: 40, textAlign: "center" }}
              // value={teamName}
              // onChange={changeTeamName}
            />
          </Form.Item>
          <br />
          <Button
            htmlType="submit"
            type="primary"
            size="large"
            style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
          >
            Create
          </Button>
          {/* </form> */}
        </Form>
      </Modal>
      <br />
      <div className="category_card">
        <AllTeamTab />
      </div>
    </div>
  );
}

export default Teams;
