import React, { useState, useEffect, useContext, useRef } from "react";
import { Input, Button, Space, Tag, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import TeamService from "../../../services/teamService";
import { TeamContext } from "../../../context/teamContext";
import { Link } from "react-router-dom";
const TeamEdit = (props) => {
  const teamId = props.match.params.teamId;
  const { teamState, teamDispatch } = useContext(TeamContext);
  const [isCheck, setIsCheck] = useState(false);
  const [updateName, setUpdateName] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const emailRef = useRef(null);
  useEffect(() => {
    const getTeamInfo = async () => {
      await TeamService.getTeamById(teamId)
        .then((result) => {
          console.log("result team : ", result);
          setUpdateName(result.data.name);
          teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
    getTeamInfo();
  }, []);

  const saveEdit = async (e) => {
    e.preventDefault();
    await TeamService.editTeamName(teamId, updateName)
      .then((result) => {
        console.log("result edit team name: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  };

  function onChange(checkedValues) {
    console.log(`checkedValues: `, checkedValues);
    setSelectedMemberId(checkedValues);
  }
  const changeCheckedItem = (e) => {
    console.log(`checked = ${e.target.checked}`);
    setIsCheck(e.target.checked);
  };
  const removeMember = async () => {
    await TeamService.removeMemberFromTeam(teamId, selectedMemberId)
      .then((result) => {
        console.log("result: ", result);
        teamDispatch({ type: "FETCH_TEAM_SUCCESS", payload: result.data });
      })
      .catch((err) => {
        console.log("error: ", err);
      });
  };

  const inviteMember = async() => {
    await TeamService.addMemberToTeam(teamId, emailRef.current)
      .then((result) => {
        console.log("add member to team result: ", result);
        teamDispatch({type: "FETCH_TEAM_SUCCESS", payload: result.data});
      })
      .catch((error) => {
        console.log("error: ", error);
        throw new Error("The space haven't add to the team.");
      });
    emailRef.current = null;
  };
  return (
    <div>
      <Link to="/dashboard/teams">
        <i class="fas fa-chevron-left"></i>
        <span>Back to Dashboard</span>
      </Link>
      <h2>Edit Team</h2>
      <form className="edit_team_wrapper" onSubmit={saveEdit}>
        <Space direction="vertical">
          <label htmlFor="team_name" className="edit_team_label">
            Team name:
          </label>
          <Input
            name="team_name"
            type="text"
            style={{ width: 250, height: 40, textAlign: "center" }}
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
          />
          <label htmlFor="team_name" className="edit_team_label">
            Host:
          </label>
          <Input
            name="team_host"
            type="text"
            style={{ width: 250, height: 40, textAlign: "center" }}
            value={teamState.team.createdBy?.name}
            onChange={(e) => setUpdateName(e.target.value)}
            readOnly
          />
          <label className="edit_team_label">
            Total members: {teamState.team.members?.length}
          </label>
          <div style={{ display: "flex" }}>
            <Input
              name="team_members"
              type="email"
              placeholder="Enter email you want to add"
              style={{ width: 250 }}
              onChange={(e) => {
                emailRef.current = e.target.value;
              }}
            />
            <Button onClick={inviteMember}>Invite</Button>
          </div>

          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Select</th>
                <th scope="col">Member Name</th>
                <th scope="col">Email</th>
                <th scope="col">Roles</th>
                {isCheck ? <th scope="col">Action</th> : null}
              </tr>
            </thead>
            <tbody>
              {teamState.team.members?.map((mem) => {
                return (
                  <tr key={mem._id}>
                    {/* <th scope="row">1</th> */}
                    <td>
                      <Checkbox.Group
                        style={{ width: "100%" }}
                        onChange={onChange}
                      >
                        <Checkbox
                          value={mem._id}
                          onChange={changeCheckedItem}
                        />
                      </Checkbox.Group>
                    </td>
                    <td>{mem.name}</td>
                    <td>{mem.email}</td>
                    <td>
                      {teamState.team.createdBy?._id === mem._id ? (
                        <Tag color="blue">Owner</Tag>
                      ) : (
                        <Tag color="magenta">Member</Tag>
                      )}
                    </td>
                    <td>
                      {isCheck ? (
                        <Button
                          className="dangerous_link"
                          type="link"
                          icon={<DeleteOutlined />}
                          onClick={removeMember}
                        />
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Button htmlType="submit" type="primary" size="large" shape="round">
            Save changes
          </Button>
        </Space>
      </form>
    </div>
  );
};

export default TeamEdit;
