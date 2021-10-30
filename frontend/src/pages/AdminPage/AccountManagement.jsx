import React, { useState, useEffect, useContext } from "react";
import { Table } from "antd";
import { Pie } from "react-chartjs-2";
import UserService from "../../services/userService";
import { UserContext } from "../../context/userContext";
const AccountManagement = (props) => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    UserService.getAllUser()
      .then((response) => {
        console.log("all user: ", response.data);
        dispatch({ type: "SET_ALL_USER", payload: response.data });
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

  const ageData = {
    labels: ["<10", "10-15", "15-18", "18"],
    datasets: [
      {
        // label: '# of Votes',
        data: [12, 19, 3, 8],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const genderData = {
    labels: ["Female", "Male"],
    datasets: [
      {
        // label: '# of Votes',
        data: [17, 30],
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const data = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
    },
    {
      key: "4",
      name: "Jim Red",
      age: 32,
      address: "London No. 2 Lake Park",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sorter: (a, b) => a.age - b.age,
      // sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",

      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
  ];

  return (
    <>
      <div>
        <div className="header_stats_wrap">
          <div className="pie_chart">
            <Pie
              data={ageData}
              // width={100}
              // height={100}
              options={{ maintainAspectRatio: false }}
            />
          </div>
          <div className="pie_chart">
            <Pie
              data={genderData}
              // width={100}
              // height={100}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
      <h2>Total user: {state?.users.length} </h2>
      <Table
        rowSelection={{
          type: "checkbox",
        }}
        columns={columns}
        dataSource={state?.users}
        onChange={handleChange}
      />
    </>
  );
};

export default AccountManagement;
