import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Empty } from "antd";
import { Link } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import SpaceService from "../../../services/spaceService";
import ItemCards from "../../ItemCards/ItemCard";
import './styles.scss'
const SpaceResult = (props) => {
  const spaceId = props.match.params.spaceId;
  const [space, setSpace] = useState(null);
  const time = new Date(space?.createdAt).toLocaleDateString("en-EN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  useEffect(() => {
    const getSpaceInfo = async () => {
      await SpaceService.getSpaceById(spaceId)
        .then((result) => {
          console.log("result space : ", result);
          setSpace(result.data);
        })
        .catch((err) => {
          throw new Error(err);
        });
    };
    getSpaceInfo();
  }, []);
  return (
    <div>
      <Breadcrumb>
        <Link to={"/"}>
          <Breadcrumb.Item>
            <HomeOutlined />
          </Breadcrumb.Item>
        </Link>
        <Link to={"/dashboard"}>
          <Breadcrumb.Item>
            <span>Dashboard</span>
          </Breadcrumb.Item>
        </Link>
        <Link to={"/dashboard/spaces"}>
          <Breadcrumb.Item>
            <span>Spaces</span>
          </Breadcrumb.Item>
        </Link>
        <Breadcrumb.Item>
          <b>{space?.name}</b>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="space_result_wrap">
        <div className="space_info">
          <h1>{space?.name}</h1>
          <span>Total Boards: {space?.boards.length}</span>
          <p>Created At: {time}</p>
          <b>Host: {space?.createdBy.name}</b>
        </div>
        <div className="space_actions">
          <Button><i class="fas fa-pen"></i><span>  + Add new Board</span></Button>
          <Button><i class="far fa-trash-alt"></i><span>   Delete</span></Button>
        </div>
      </div>
      <h3>Board list</h3>
      <div className="item_wrap">
        {space?.boards.map((board, index) => {
          return <ItemCards key={index} board={board}/>;
        })}
      </div>
    </div>
  );
};

export default SpaceResult;
