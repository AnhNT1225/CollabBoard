import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const AdminNavBar = () => {
  const searchItem = () => {};
  return (
    <div>
      <Input
        // className="search_dashoard"
        prefix={<SearchOutlined style={{ fontSize: 20 }} />}
        size="large"
        placeholder="Search for items"
        style={{
          borderRadius: 10,
          width: 300,
          marginLeft: 70,
        //   width: "300px",
        //   height: "50px",
        }}
        onChange={searchItem}
      />
    </div>
  );
};

export default AdminNavBar;
