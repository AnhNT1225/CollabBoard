import React, { useState, useEffect, useContext } from "react";
import { Table, Popconfirm, Space, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link, useRouteMatch } from "react-router-dom";
import TeamService from "../../../services/teamService";
import { TeamContext } from "../../../context/teamContext";
import "./styles.scss";

const AllTeamTab = (props) => {
  const { teamState, teamDispatch } = useContext(TeamContext);

  const { path, url } = useRouteMatch();
  console.log("team all path: ", path);
  useEffect(() => {
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getJoinedTeam()
      .then((result) => {
        console.log("all join team: ", result);
        teamDispatch({ type: "FETCH_TEAMS_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  const columns = [
    {
      title: "Team Name",
      dataIndex: ["_id", "name"],
      key: "_id",
      render: (unknown, team) => {
        return <Link to={`${url}/${team._id}`}>{team.name}</Link>;
      },
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "_id",
      render: (members) => <p>{members.length} people</p>,
    },
    {
      title: "Documents",
      dataIndex: "boards",
      key: "_id",
      render: (boards) => <p>{boards.length} items</p>,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => {
        console.log("team id: ", id);
        const confirmDelete = async (e) => {
          console.log(e);
          console.log("is that id: ", id);
          teamDispatch({ type: "DELETE_TEAM", payload: id });
          await TeamService.deleteTeam(id)
            .then((result) => {
              console.log("result: ", result);
              message.success(result.message);
            })
            .catch((error) => {
              console.log("error: ", error);
            });
        };

        return (
          <Space size="large">
            <Link to={`${url}/${id}/edit`}>Edit</Link>
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={confirmDelete}
              okText="Yes"
              cancelText="No"
            >
              <Link className="dangerous_link" to={"#"}>
                <DeleteOutlined /> Delete
              </Link>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  // const components = {
  // 	body: {
  // 		row: EditableRow,
  // 		cell: EditableCell,
  // 	},
  // };
  // const columns = this.columns.map((col) => {
  // 	if (!col.editable) {
  // 		return col;
  // 	}

  // 	return {
  // 		...col,
  // 		onCell: (record) => ({
  // 			record,
  // 			editable: col.editable,
  // 			dataIndex: col.dataIndex,
  // 			title: col.title,
  // 			handleSave: this.handleSave,
  // 		}),
  // 	};
  // });

  return (
    <>
      <Table
        // components={components}
        // rowClassName={() => "editable-row"}
        bordered
        dataSource={teamState.teams}
        columns={columns}
      />
    </>
  );
};

export default AllTeamTab;
