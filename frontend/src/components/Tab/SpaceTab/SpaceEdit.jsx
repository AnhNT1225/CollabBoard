import React, { useState, useEffect, useContext } from "react";
import { Input, Button, Space, Select } from "antd";
import TeamService from "../../../services/teamService";
import SpaceService from "../../../services/spaceService";
import { SpaceContext } from "../../../context/spaceContext";
import { TeamContext } from "../../../context/teamContext";

import { Link } from "react-router-dom";
const { Option } = Select;

const SpaceEdit = (props) => {
  const spaceId = props.match.params.spaceId;
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  const { teamState, teamDispatch } = useContext(TeamContext);
  // const [space, setSpace] = useState(null);
  const [form, setForm] = useState(null);
  // const [form, setForm] = useState({
  //   name: spaceState.space?.name,
  //   team: {
  //     id: spaceState.space.teamId?._id,
  //     name: spaceState.space.teamId?.name,
  //   },
  // });
  useEffect(() => {
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
  }, [teamDispatch]);

  useEffect(() => {
    const getSpaceInfo = async () => {
      spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
      await SpaceService.getSpaceById(spaceId)
        .then((result) => {
          console.log("result space: ", result);
          setForm({name: result.data.name,
              team: {
                id: result.data.teamId?._id,
                name: result.data.teamId?.name,
              },})
          spaceDispatch({ type: "FETCH_SPACE_SUCCESS", payload: result.data });
          // setSpace(result.data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
    getSpaceInfo();
  }, [spaceDispatch, spaceId]);

  console.log("teamId: ", spaceState.space.teamId?._id);

  const saveSpaceEdit = async (e) => {
    e.preventDefault();
    //if space doesn not stored in any team, add space to new team
    if (!spaceState.space.teamId?._id && form) {
         await SpaceService.updateSpaceInfo(spaceId, form)
        .then((result) => {
          console.log("result of updated space name and TEAM spaces: ", result);
          spaceDispatch({ type: "UPDATE_SPACE", payload: result.data });
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    } else {
      //if space has existed team, remove space from old team -> addToNewTeam
      await TeamService.removeSpaceFromTeam(
        spaceId,
        spaceState.space.teamId?._id,
      )
        .then((result) => {
          console.log("result of remove space from old team: ", result);
        })
        .catch((err) => {
          console.log("error: ", err);
        });

      await SpaceService.updateSpaceInfo(spaceId, form)
        .then((result) => {
          console.log("result of updated space name and TEAM spaces: ", result);
          spaceDispatch({ type: "UPDATE_SPACE", payload: result.data });
        })
        .catch((err) => {
          console.log("error: ", err);
        });
    }
    // await setForm(null);
  };

  return (
    <div>
      <Link to="/dashboard/spaces">
        <i className="fas fa-chevron-left"></i>
        <span>Back to Dashboard</span>
      </Link>
      <h2>Edit Space</h2>
      <form className="edit_space_wrapper" onSubmit={saveSpaceEdit}>
        <Space direction="vertical">
          <label htmlFor="space_name" className="edit_space_label">
            Space name:
          </label>
          <Input
            name="space_name"
            type="text"
            style={{ width: 250, height: 40, textAlign: "center" }}
            value={form?.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <label htmlFor="space_name" className="edit_space_label">
            Created By:
          </label>
          <Input
            name="space_host"
            type="text"
            style={{ width: 250, height: 40, textAlign: "center" }}
            value={spaceState.space.createdBy?.name}
            readOnly
          />
          <label className="edit_space_label">
            Total boards: 
          </label>
          <Input
            name="space_boards"
            type="text"
            style={{ width: 250, height: 40, textAlign: "center" }}
            value={spaceState.space.boards?.length}
            readOnly
          />
          <Space direction="horizontal">
          <label htmlFor="space_team" className="edit_space_label">
            Team:
          </label>
          <Select
            defaultValue={!form?.team.name ? "No space" : form?.team.name}
            style={{ width: 120 }}
            onChange={(value, obj) => {
              console.log("value: ", value, "obj _id: ", obj.name);
              setForm((prev) => ({
                ...prev,
                team: { id: obj.name, name: value },
              }));
            }}
          >
            {teamState.teams.map((team) => {
              return (
                <Option key={team._id} name={team._id} value={team.name}>
                  {team.name}
                </Option>
              );
            })}
          </Select>
          </Space>
          <Button htmlType="submit" type="primary" size="middle">
            Save changes
          </Button>
        </Space>
      </form>
    </div>
  );
};

export default SpaceEdit;
