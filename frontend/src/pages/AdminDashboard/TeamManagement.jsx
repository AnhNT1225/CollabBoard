import React, { useState, useEffect, useContext } from "react";
import { Table } from "antd";
import TeamService from "../../services/teamService";
import { TeamContext } from "../../context/teamContext";
const TeamManagement = (props) => {
  const {setDataSource, dataSource,searchInput} = props
  const [sortedInfo, setSortedInfo] = useState(null);
  const { teamState, teamDispatch } = useContext(TeamContext);
  useEffect(() => {
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getAllTeams()
      .then((response) => {
        console.log("all team: ", response.data);
        teamDispatch({ type: "FETCH_TEAMS_SUCCESS", payload: response.data });
        setDataSource(response.data)
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  const handleChange = (pagination, sorter) => {
    console.log("Various parameters", pagination, sorter);
    setSortedInfo(sorter);
  };

  if(searchInput === ''){
    setDataSource(teamState?.teams)
  }

  const columns = [
    {
      title: "Team Name",
      dataIndex: "name",
      key: "name",
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Create By",
      dataIndex: "createdBy",
      key: "createdBy",
      sorter: (a, b) => a.name - b.name,
      render: (user) => <span>{user?.name}</span>,
      // sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Members",
      dataIndex: "members",
      key: "members",

      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.members.length - b.members.length,
      render: (members) => <span>{members?.length} people</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Boards",
      dataIndex: "boards",
      key: "boards",

      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      render: (boards) => <span>{boards?.length} boards</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Spaces",
      dataIndex: "spaces",
      key: "spaces",

      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      render: (spaces) => <span>{spaces?.length} spaces</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",

      // onFilter: (value, record) => record.createdAt.includes(value),
      render: (createdAt) => (
        <span>
          {new Date(createdAt).toLocaleDateString("en-EN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
  ];
  return (
    <div>
      <h2>Total team: {teamState?.teams.length} </h2>
      <Table
        // rowSelection={{
        //   type: "checkbox",
        // }}
        columns={columns}
        dataSource={dataSource}
        onChange={handleChange}
        rowKey='_id'
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default TeamManagement;
