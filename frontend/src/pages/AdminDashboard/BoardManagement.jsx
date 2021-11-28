import React, { useState, useEffect, useContext } from "react";
import { Table } from "antd";
import BoardService from "../../services/boardService";
import { BoardContext } from "../../context/boardContext";
const BoardManagement = () => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const { boardState, boardDispatch } = useContext(BoardContext);
  useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    BoardService.getAllBoard()
      .then((response) => {
        console.log("all board: ", response.data);
        boardDispatch({ type: "FETCH_BOARDS_SUCCESS", payload: response.data });
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

  const columns = [
    {
      title: "Board Title",
      dataIndex: "name",
      key: "name",
      // onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      render: (name) => <span>{name}</span>,
      // sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      sorter: (a, b) => a.code - b.code,
      // sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Create By",
      dataIndex: "createdBy",
      key: "createdBy",

      // onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name - b.name,
      render: (user) => <span>{user?.name}</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Stored At (SPACE)",
      dataIndex: "spaceId",
      key: "spaceId",

      render: (space) => <span>{space?.name}</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Contributors",
      dataIndex: "contributors",
      key: "contributors",

      sorter: (a, b) => a?.contributors.length - b?.contributors.length,
      render: (contributors) => <span>{contributors.length}</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",

      // onFilter: (value, record) => record.createdAt.includes(value),
      render: (createdAt) => <span>{new Date(createdAt).toLocaleDateString("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}</span>,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
  ];
  return (
    <div>
      <h2>Total board: {boardState?.boards.length} </h2>
      <Table
        rowSelection={{
          type: "checkbox",
        }}
        columns={columns}
        dataSource={boardState?.boards}
        onChange={handleChange}
      />
    </div>
  );
};

export default BoardManagement;
