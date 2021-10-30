import React, { useContext, useState } from "react";
import {  Button, Modal, Input, message } from "antd";
import { FolderAddOutlined } from "@ant-design/icons";
import AllSpaceTab from "../../components/Tab/SpaceTab/AllSpaceTab";

import SortTool from "../../components/SortTool";
import SpaceService from "../../services/spaceService";
import { SpaceContext } from "../../context/spaceContext";

const Spaces = (props) => {
  const [createSpaceModal, setCreateSpaceModal] = useState(false);
  const { spaceDispatch } = useContext(SpaceContext);
  const [spaceName, setSpaceName] = useState(null);
  const changeSpaceName = async (e) => {
    const name = e.target.value;
    console.log("space name: ", name);
    setSpaceName(name);
  };

  const createNewSpace = async (e) => {
    e.preventDefault();
    await SpaceService.createSpace(spaceName)
      .then((result) => {
        console.log("result: ", result);
        spaceDispatch({ type: "CREATE_SPACE", payload: result.space });
        message.success(result.message);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
    await setSpaceName(null);
    setCreateSpaceModal(false);
  };
  return (
    <div className="space_content_wrap">
      <div className="content_header">
        <h1 className="title">All spaces</h1>
        <Button
          icon={<FolderAddOutlined style={{ fontSize: 30 }} />}
          className="create_btn"
          onClick={() => setCreateSpaceModal(true)}
        />
        {/* + Create
				</Button> */}
        <Modal
          title="Create new space"
          // bodyStyle={{ padding: "2rem", height: 300 }}
          style={{ textAlign: "center" }}
          centered
          visible={createSpaceModal}
          onOk={() => setCreateSpaceModal(false)}
          onCancel={() => setCreateSpaceModal(false)}
          footer={null}
          keyboard
        >
          <form className="room_code_wrapper" onSubmit={createNewSpace}>
            <label className="room_code_label">Space name</label>
            <br />
            <Input
              style={{ width: 250, height: 40, textAlign: "center" }}
              value={spaceName}
              onChange={changeSpaceName}
            />
            <br />
            <Button
              htmlType="submit"
              type="primary"
              size="large"
              style={{ width: 100, borderRadius: 5, fontWeight: "bold" }}
            >
              Create
            </Button>
          </form>
        </Modal>
      </div>
      <div className="category_card">
        <SortTool />
        <AllSpaceTab />
      </div>
    </div>
  );
};

export default Spaces;
