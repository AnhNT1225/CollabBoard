import React, { useContext, useEffect, useState } from "react";
import CreateBoardModal from "../../components/AppModal/CreateBoardModal";
import { Tabs } from "antd";
import AllBoardTab from "../../components/Tab/PrototypeTab/AllBoardTab";
import OwnedBoardTab from "../../components/Tab/PrototypeTab/OwnedBoardTab";
import SortTool from "../../components/SortTool/SortTool";
import BoardService from "../../services/boardService";
import { BoardContext } from "../../context/boardContext";
import {SpaceContext} from '../../context/spaceContext';
import SpaceService from "../../services/spaceService";
const { TabPane } = Tabs;

const Prototypes = (props) => {
  const { searchInput, socket, sideComponent } = props;
  // const [deletedId, setDeletedId] = useState(null)
  const { boardDispatch } = useContext(BoardContext);
  const { spaceDispatch } = useContext(SpaceContext);
  const [sortType, setSortType] = useState('date_created')
    useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    getJoinedItems()
  }, []);

  const getJoinedItems = async () => {
    await BoardService.getJoinedBoard()
      .then((response) => {
        boardDispatch({
          type: "FETCH_BOARDS_SUCCESS",
          payload: response.data,
        });
        // setBoards(response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const getOwnedItems = async () => {
    await BoardService.getOwnedBoard()
      .then((response) => {
        boardDispatch({
          type: "FETCH_BOARDS_SUCCESS",
          payload: response.data,
        });
        // setBoards(response.boards);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const getSpaceLists = async () => {
    await  SpaceService.getOwnedSpaces()
    .then((result) => {
      console.log("result from all board tab: ", result);
      spaceDispatch({ type: "FETCH_SPACES_SUCCESS", payload: result.data });
    })
    .catch((error) => {
      console.log("error: ", error);
    });
  };
  // useEffect(() => {
  //   boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
  //   getJoinedItems();
  // }, []);
 

  const changeTab = async (tab) => {
    console.log("key ", tab);
    switch (tab) {
      case "1":
        getJoinedItems()
        break;
      case "2":
        getOwnedItems()
        break;
      default:
        break;
    }
  };

  return (
    <div className="board_content_wrap">
      <CreateBoardModal socket={socket}/>
      <div className="category_card">
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="All" key="1">
            <SortTool setSortType={setSortType}/>
            <AllBoardTab sortType={sortType} searchInput={searchInput} getJoinedItems={getJoinedItems} getSpaceLists={getSpaceLists} socket={socket} sideComponent={sideComponent}/>
          </TabPane>
          <TabPane tab="Created by me" key="2">
            <SortTool setSortType={setSortType}/>
            <OwnedBoardTab sortType={sortType} searchInput={searchInput} getOwnedItems={getOwnedItems} getSpaceLists={getSpaceLists} socket={socket} sideComponent={sideComponent}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Prototypes;
