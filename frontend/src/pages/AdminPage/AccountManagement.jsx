import React, { useState, useEffect, useContext } from "react";
import { Table } from "antd";
import { Pie } from "react-chartjs-2";
import UserService from "../../services/userService";
import { UserContext } from "../../context/userContext";
const AccountManagement = (props) => {
  const [sortedInfo, setSortedInfo] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const [groupAge, setGroupAge] = useState({
    under10: null,
    between10and15: null,
    between15and18: null,
    over18: null,
    undefined: null,
  });

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

  const currentYear = new Date().getFullYear();
  console.log("current Year: ", currentYear);

  // state.users?.forEach((user) => {
  //   if (user.DoB) {
  //     const userAge = currentYear - new Date(user.DoB).getFullYear();
  //     console.log("user Age: ", userAge);
  //     if (userAge < 10) {
  //       setGroupAge((prev) => [...prev.under10, user]);
  //     } else if (userAge >= 10 && userAge < 15) {
  //       setGroupAge((prev) => [...prev.between10and15, user]);
  //     } else if (userAge >= 15 && userAge < 18) {
  //       setGroupAge((prev) => [...prev.between15and18, user]);
  //     } else if (userAge >= 18) {
  //       console.log("user inside: ", user);
  //       setGroupAge((prev) => [...prev.over18, user]);
  //     } else {
  //       setGroupAge((prev) => [...prev.undefined, user]);
  //     }
  //   }
  // });

  const handleChange = (pagination, sorter) => {
    console.log("Various parameters", pagination, sorter);
    setSortedInfo(sorter);
  };

  console.log("check array: ", groupAge);
  const ageData = {
    labels: [
      "Under 10 age",
      "From 10 to 15 age",
      "From 15 to 18 age",
      "Over 18 age",
      "Undefined",
    ],
    datasets: [
      {
        data: [
          12, 7, 9, 5
          // groupAge.under10?.length,
          // groupAge.between10and15?.length,
          // groupAge.between15and18?.length,
          // groupAge.over18?.length,
        ],
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
      dataIndex: "DoB",
      key: "DoB",
      // sorter: (a, b) => a.age - b.age,
      render: (DoB) => (
        <span>
          {DoB ? currentYear - new Date(DoB).getFullYear() : "Not updated"}
        </span>
      ),
      // sortOrder: sortedInfo.columnKey === "age" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",

      onFilter: (value, record) => record.email.includes(value),
      sorter: (a, b) => a.email.length - b.email.length,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",

      onFilter: (value, record) => record.gender.includes(value),
      sorter: (a, b) => a.gender.length - b.gender.length,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",

      onFilter: (value, record) => record.position.includes(value),
      sorter: (a, b) => a.position.length - b.position.length,
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
