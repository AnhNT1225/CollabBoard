import React, { useState, useEffect, useContext } from "react";
import { Input, Button, Space, Tag, Checkbox } from "antd";
import { LeftOutlined, DeleteOutlined } from "@ant-design/icons";
import TeamService from "../../../services/teamService";
import { TeamContext } from "../../../context/teamContext";
import { Link } from "react-router-dom";
const TeamEdit = (props) => {
  const teamId = props.match.params.teamId;
  const { teamDispatch } = useContext(TeamContext);
  const [team, setTeam] = useState(null);
  const [isCheck, setIsCheck] = useState(false);
  const [updateName, setUpdateName] = useState(team?.name);

  useEffect(() => {
    const getTeamInfo = async () => {
      await TeamService.getTeamById(teamId)
        .then((result) => {
          setTeam(result.data);
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
        console.log("result: ", result);
        teamDispatch({ type: "UPDATE_TEAM_NAME", payload: result.data });
      })
      .catch((err) => {
        console.log("error: ", err);
      });
    await setUpdateName(null);
  };

  function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
    setIsCheck(e.target.checked);
  }

  return (
    <div>
      <Link to="/dashboard/teams" >
      <i class="fas fa-chevron-left"></i>
        <span >Back to Dashboard</span>
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
            value={team?.createdBy.name}
            onChange={(e) => setUpdateName(e.target.value)}
            disabled
          />
          <label className="edit_team_label">
            Total members: {team?.members.length}
          </label>
          <div style={{ display: "flex" }}>
            <Input
              name="team_members"
              type="email"
              placeholder="Enter email you want to add"
              style={{ width: 250 }}
              onChange={(e) => setUpdateName(e.target.value)}
            />
            <Button>Invite</Button>
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
              {team?.members.map((mem) => {
                return (
                  <tr key={mem._id}>
                    {/* <th scope="row">1</th> */}
                    <td>
                      <Checkbox onChange={onChange} />
                    </td>
                    <td>{mem.name}</td>
                    <td>{mem.email}</td>
                    <td>
                      {team?.createdBy._id === mem._id ? (
                        <Tag color="blue">Owner</Tag>
                      ) : (
                        <Tag color="magenta">Member</Tag>
                      )}
                    </td>
                    <td>{isCheck ? <Link to={"#"}><DeleteOutlined /></Link> : null}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Button htmlType="submit" type="primary" size="middle">
            Save changes
          </Button>
        </Space>
      </form>
    </div>
  );
};

export default TeamEdit;
