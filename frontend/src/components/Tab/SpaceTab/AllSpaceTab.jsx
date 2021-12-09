import React, { useEffect, useContext, useState } from "react";
import SpaceService from "../../../services/spaceService";
import { message, Popconfirm, Space, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Link, useRouteMatch } from "react-router-dom";
import { SpaceContext } from "../../../context/spaceContext";
import { getUserId } from "../../../lib/auth";
const AllSpaceTab = (props) => {
  const ownedId = getUserId();
  const { url } = useRouteMatch();
  const { searchInput, setDataSource, dataSource, sideComponent, sortType } =
    props;
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  // const [source, setSource] = useState('')
  useEffect(() => {
    spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
    SpaceService.getJoinedSpaces()
      .then((result) => {
        console.log("result: ", result);
        setDataSource(result.data);
        spaceDispatch({ type: "FETCH_SPACES_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  if (searchInput === "") {
    setDataSource(spaceState?.spaces);
  }

  if (sortType === "date_created") {
    const increase = spaceState?.spaces
      .filter((space) => {
        return new Date(space.createdAt) && new Date(space.updatedAt);
      })
      .sort(function (a, b) {
        return a - b;
      });
     console.log("increase: ", increase);
  } else if (sortType === "date_updated") {
    const decrease = spaceState?.spaces
      .filter((space) => {
        return new Date(space.createdAt) && new Date(space.updatedAt);
      })
      .sort(function (a, b) {
        return b - a;
      });
    console.log("decrease: ", decrease);
  }
  const columns = [
    {
      title: "Name",
      dataIndex: ["_id", "name"],
      key: "name",
      render: (unknown, space) => {
        const newTo = {
          pathname: `${url}/${space._id}`,
          paramSpace: sideComponent,
        };
        return <Link to={newTo}>{space.name}</Link>;
      },
    },
    {
      title: "Documents",
      dataIndex: "boards",
      key: "boards",
      render: (boards) => <p>{boards?.length} boards</p>,
    },
    {
      title: "Author",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (user) => (
        <Link to={`/user/profile/${user._id}`}>{user.name}</Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (user) => (
        <Tag color="green" key={user._id}>
          {user._id === ownedId ? "Owned" : "Joined"}
        </Tag>
      ),
    },
    // {
    // 	title: "Member",
    // 	dataIndex: "members",
    // 	key: "members",
    // 	render: (members) => members.length,
    // },
    {
      title: "Action",
      dataIndex: "_id",
      key: "action",
      render: (id) => {
        // console.log("space id: ", id);
        const confirmDelete = async (e) => {
          console.log(e);
          console.log("is that id: ", id);
          spaceDispatch({ type: "DELETE_SPACE", payload: id });
          await SpaceService.deleteSpace(id)
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

  return (
    <>
      {dataSource && <Table
        // components={components}
        // rowClassName={() => "editable-row"}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 8 }}
        scroll={{ y: 240 }}
        rowKey="_id"
      />}
    </>
  );
};

export default AllSpaceTab;
