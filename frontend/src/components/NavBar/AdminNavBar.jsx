import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

import "./styles.scss";
const AdminNavBar = (props) => {
  const {setSearchInput, dataSource,setDataSource} = props

  // const searchItem = () => {};
  // const options = [
  //   {
  //     value: "Burns Bay Road",
  //   },
  //   {
  //     value: "Downing Street",
  //   },
  //   {
  //     value: "Wall Street",
  //   },
  // ];

  return (
    <div>
      {/* <AutoComplete
        options={options}
        filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
      > */}
        <Input
        prefix={<SearchOutlined/>}
          style={{
            marginTop: 20,
            borderRadius: 5,
            width: 300,
            marginLeft: 70,
          }}
          size="large"
          placeholder="Search for items"
          onChange={async (e) => {
            const currValue = await e.target.value;
            setSearchInput(currValue);
            const filteredData = dataSource.filter(entry =>
              entry.name.toLowerCase().includes(currValue.toLowerCase())
            );
            setDataSource(filteredData);
          }}
        />
      {/* </AutoComplete> */}
    </div>
  );
};

export default AdminNavBar;
