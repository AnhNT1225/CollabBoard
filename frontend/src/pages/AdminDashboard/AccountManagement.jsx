import React, { useState, useEffect, useContext } from "react";
import { Table, Space, message, Button, Popconfirm } from "antd";
import {DeleteOutlined } from '@ant-design/icons'
import { Pie } from "react-chartjs-2";
import UserService from "../../services/userService";
import { UserContext } from "../../context/userContext";

const AccountManagement = (props) => {
  // const [sortedInfo, setSortedInfo] = useState(null);
  const {setDataSource, dataSource, searchInput} = props
  const [isOpen, setIsOpen] = useState(false)
  const { state, dispatch } = useContext(UserContext);
  const [under10, setUnder10] = useState(0);
  const [between10and15, setBetween10and15] = useState(0);
  const [between15and18, setBetween15and18] = useState(0);
  const [over18, setOver18] = useState(0);
  const [female, setFemale] = useState(0);
  const [male, setMale] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const currentYear = new Date().getFullYear();

  const filterGender = (userData) => {
    const userArr = [...userData];
    const hasGender = userArr.filter((user) => user.DoB !== null);
    const female = hasGender.filter((user) => {
      return user.gender ==="Female";
    });
    const male = hasGender.filter((user) => {
      return user.gender === "Male";
    });
    setFemale(female.length)
    setMale(male.length)
  }
  
  const filterAge = (userData) => {
    const userArr = [...userData];
    const hasAge = userArr.filter((user) => user.DoB !== null);
    const min_10 = hasAge.filter((user) => {
      const userAge = currentYear - new Date(user?.DoB).getFullYear();
      return userAge <= 10;
    });
    const around_15 = hasAge.filter((user) => {
      const userAge = currentYear - new Date(user?.DoB).getFullYear();
      return 10 < userAge && userAge <= 15;
    });
    const around_18 = hasAge.filter((user) => {
      const userAge = currentYear - new Date(user?.DoB).getFullYear();
      return 15 < userAge && userAge <= 18;
    });
    const over_18 = hasAge.filter((user) => {
      const userAge = currentYear - new Date(user?.DoB).getFullYear();
      return userAge > 18;
    });
    setUnder10(min_10.length)
    setBetween10and15(around_15.length)
    setBetween15and18(around_18.length)
    setOver18(over_18.length)
  };

  // console.log("current Year: ", currentYear);
  useEffect(() => {
    UserService.getAllUser()
      .then((response) => {
        dispatch({ type: "SET_ALL_USER", payload: response.data });
        setDataSource(response.data)
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    filterAge(state?.users);
    filterGender(state?.users)
  }, [state]);

  if(searchInput === ''){
    setDataSource(state?.users)
  }

  const handleChange = (pagination, sorter) => {
    console.log("Various parameters", pagination, sorter);
    // setSortedInfo(sorter);
  };

  // console.log("check array: ", groupAge);
  const ageData = {
    labels: [
      "Under 10 age",
      "From 10 to 15 age",
      "From 15 to 18 age",
      "Over 18 age",
    ],
    datasets: [
      {
        data: [under10, between10and15, between15and18, over18, unknown],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(39, 202, 30, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(39, 202, 30, 1)",
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
        data: [female, male],
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
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      // sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Age",
      dataIndex: "DoB",
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

      onFilter: (value, record) => record.email.includes(value),
      sorter: (a, b) => a.email.length - b.email.length,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Gender",
      dataIndex: "gender",

      onFilter: (value, record) => record.gender.includes(value),
      sorter: (a, b) => a.gender.length - b.gender.length,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Position",
      dataIndex: "position",

      onFilter: (value, record) => record.position.includes(value),
      sorter: (a, b) => a.position.length - b.position.length,
      // sortOrder: sortedInfo.columnKey === "address" && sortedInfo.order,
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (id) => {
        console.log("user id: ", id);
        const confirmDelete = async (e) => {
          console.log(e);
          console.log("is that id: ", id);
          dispatch({ type: "DELETE_USER", payload: id });
          await UserService.deleteUser(id)
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
            <Popconfirm
              title="Are you sure to delete this task?"
              onConfirm={confirmDelete}
              okText="Yes"
              cancelText="No"
            >
              <Button type='link' className="dangerous_link" style={{color: 'red'}}>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
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
          onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setIsOpen(!isOpen)
          },
        }}
        rowKey="_id"
        columns={columns}
        dataSource={dataSource}
        onChange={handleChange}
      />
    </>
  );
};

export default AccountManagement;
