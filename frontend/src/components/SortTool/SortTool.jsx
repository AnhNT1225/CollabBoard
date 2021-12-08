import React from "react";
import { Button, Select } from "antd";
import {
  // SortAscendingOutlined,
  // SortDescendingOutlined,
  // EyeOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  FolderOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import "./styles.scss";
const { Option } = Select;

const SortTool = (props) => {
  const { setSortType } = props;
  function handleChange(value) {
    console.log(`selected ${value}`);
    switch (value) {
      case "date_created":
        setSortType("Date created");
        break;
      case "date_update":
        setSortType("Date updated");
        break;
      default:
        break;
    }
  }
  return (
    <>
      <div className="item_management">
        <div className="sort_space">
          <label>Sort by: </label>
          <Select
            defaultValue="date_created"
            style={{ width: 160 }}
            onChange={handleChange}
            bordered={false}
          >
            <Option value="date_created">
              Date created <PlusOutlined className="sort_icon" />
            </Option>
            <Option value="date_update">
              Update date
              <ClockCircleOutlined className="sort_icon" />
            </Option>
            {/* <Option value="last_view">
							Last view <EyeOutlined className="sort_icon" />
						</Option>
						<Option value="ascending">
							Ascending <SortAscendingOutlined className="sort_icon" />
						</Option>
						<Option value="desscending">
							Descending <SortDescendingOutlined className="sort_icon" />
						</Option> */}
          </Select>
        </div>
        <div className="layout_space">
          <Button
            type="text"
            icon={<FolderOutlined style={{ fontSize: 20 }} />}
          ></Button>
          <Button
            type="text"
            icon={<AppstoreOutlined style={{ fontSize: 20 }} />}
          ></Button>
        </div>
      </div>
    </>
  );
};

export default SortTool;
