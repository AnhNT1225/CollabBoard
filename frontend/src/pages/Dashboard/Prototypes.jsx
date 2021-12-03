import React, { useContext, useEffect } from "react";
import CreateBoardModal from "../../components/AppModal/CreateBoardModal";
import { Tabs } from "antd";
import AllBoardTab from "../../components/Tab/PrototypeTab/AllBoardTab";
import OwnedBoardTab from "../../components/Tab/PrototypeTab/OwnedBoardTab";
import SortTool from "../../components/SortTool";
import BoardService from "../../services/boardService";
import { BoardContext } from "../../context/boardContext";
import {UserContext} from '../../context/userContext';
import UserService from '../../services/userService';
import {SpaceContext} from '../../context/spaceContext';
import SpaceService from "../../services/spaceService";
const { TabPane } = Tabs;

const Prototypes = (props) => {
  const { searchInput, socket } = props;
  // const [deletedId, setDeletedId] = useState(null)
  const { boardDispatch } = useContext(BoardContext);
  const { spaceDispatch } = useContext(SpaceContext);
  const {dispatch} = useContext(UserContext)
  // useEffect(() => {
  //     const getUser = async() => {
  //         UserService.getCurrentUser()
  //       .then(async(user) => {
  //         await dispatch({type: 'GET_USER', payload: user})
  //       })
  //       .catch((error) => {
  //         if(error){
  //           throw new Error(error);
  //         }      
  //       });
          
  //     }
  //     getUser();
  // }, [])
  
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
  };

  return (
    <div className="board_content_wrap">
      <CreateBoardModal socket={socket}/>
      <div className="category_card">
        <Tabs defaultActiveKey="1" onChange={changeTab}>
          <TabPane tab="All" key="1">
            <SortTool />
            <AllBoardTab searchInput={searchInput} getJoinedItems={getJoinedItems} getSpaceLists={getSpaceLists} socket={socket}/>
          </TabPane>
          <TabPane tab="Created by me" key="2">
            <SortTool />
            <OwnedBoardTab searchInput={searchInput} getOwnedItems={getOwnedItems} getSpaceLists={getSpaceLists} socket={socket}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Prototypes;
