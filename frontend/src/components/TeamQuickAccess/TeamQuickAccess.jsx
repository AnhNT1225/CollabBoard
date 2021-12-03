import React, { useEffect, useContext, useState } from "react";
import TeamService from "../../services/teamService";
import { TeamContext } from "../../context/teamContext";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message, Input, Modal, Space } from "antd";
import { useHistory, Link } from "react-router-dom";
import "./styles.scss";
import { getUserRole } from "../../lib/auth";
const TeamQuickAccess = () => {
  const { teamState, teamDispatch } = useContext(TeamContext);
  const [createTeamModal, setCreateTeamModal] = useState(false);
  const [teamName, setTeamName] = useState(null);
  const history= useHistory()
  useEffect(() => {
    const userRole = getUserRole();
    if(userRole === "user"){
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getJoinedTeam()
      .then((result) => {
        console.log("result team: ", result);
        teamDispatch({ type: "FETCH_TEAMS_SUCCESS", payload: result.data });
        // setSpace(result.data);
      })
      .catch((err) => {
        throw new Error(err);
      });
    }
    else{
      return null
    }
  }, []);

  const changeTeamName = (e) => {
    const name = e.target.value;
    console.log("space name: ", name);
    setTeamName(name);
};

  const createNewTeam = async (e) => {
    e.preventDefault();
    await TeamService.createTeam(teamName)
      .then((result) => {
        console.log("result: ", result);
        teamDispatch({ type: "CREATE_TEAM", payload: result.data });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    await setTeamName(null);
    setCreateTeamModal(false);
  };

  return (
    <div>
      <div className="team_quick_access">
        <b className="access_title">Team</b>
        <Button type="text" icon={<PlusOutlined />} onClick={() => setCreateTeamModal(true)} />
        <Modal
				title="Create new team"
				// bodyStyle={{ padding: "2rem", height: 300 }}
				style={{ textAlign: "center"}}
				centered
				visible={createTeamModal}
				onOk={() => setCreateTeamModal(false)}
				onCancel={() => setCreateTeamModal(false)}
				footer={null}
				keyboard
			>
				<form className="create_team_wrapper" onSubmit={createNewTeam}>
                    <Space direction='vertical'>
					<label className="create_team_label">Team name</label>
					<Input
						style={{ width: 250, height: 40, textAlign: "center" }}
						value={teamName}
						onChange={changeTeamName}	
					/>
					<Button
						htmlType="submit"
						type="primary"
						size="large"
						style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
					>
						Create
					</Button>
                    </Space>
				</form>
			</Modal>
      </div>
      <div className="team_item_container">

          {teamState.teams.map((team) => {
            return <Link key={team._id} className='team_item' to={`/dashboard/teams/${team._id}`}>{team.name}</Link>;
          })}

      </div>
    </div>
  );
};

export default TeamQuickAccess;
