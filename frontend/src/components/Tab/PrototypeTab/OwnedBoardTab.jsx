import React, { useContext, useEffect, useState } from "react";
import { Empty, Pagination } from "antd";
import ItemCards from "../../ItemCards/ItemCard";
import { BoardContext } from "../../../context/boardContext";
import {SpaceContext} from '../../../context/spaceContext';
import BoardService from "../../../services/boardService";
const OwnedBoardTab = (props) => {
  const { searchInput, sortType, getSpaceLists, socket } = props;
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  const [itemNumber, setItemNumber] = useState({ minValue: 0, maxValue: 4 });
  // useEffect(() => {
  //   boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
  //   BoardService.getOwnedBoard()
  //     .then((response) => {
  //       boardDispatch({
  //         type: "FETCH_BOARDS_SUCCESS",
  //         payload: response.data,
  //       });
  //       // setBoards(response.data);
  //     })
  //     .catch((error) => {
  //       console.log("error: ", error);
  //     });
    
  // }, [boardDispatch]);

  if (sortType === "date_created") {
    const increase = boardState?.boards
      .filter((board) => {
        return new Date(board.createdAt) && new Date(board.updatedAt);
      })
      .sort(function (a, b) {
        return a - b;
      });
     console.log("increase: ", increase);
  } else if (sortType === "date_updated") {
    const decrease = boardState?.boards
      .filter((board) => {
        return new Date(board.createdAt) && new Date(board.updatedAt);
      })
      .sort(function (a, b) {
        return b - a;
      });
    console.log("decrease: ", decrease);
  }

  useEffect(() => {
    spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
    getSpaceLists();
  }, []);
  // let foundBoards;
  // if (searchInput) {
  //   foundBoards = boardState.boards.filter((board) => {
  //     return board.name.toLowerCase().includes(searchInput.toLowerCase());
  //   });
  // }
  useEffect(() => {
    boardDispatch({ type: "SEARCH_BOARD", payload: searchInput });
  }, [searchInput, boardDispatch]);

  const onChangePage = (pageNumber, pageSize) => {
    console.log("Page: ", pageNumber);
    console.log("pageSize: ", pageSize);
    if (pageNumber <= 1) {
      setItemNumber({
        minValue: 0,
        maxValue: 4,
      });
    } else {
      setItemNumber({
        minValue: itemNumber.maxValue,
        maxValue: itemNumber.maxValue + pageSize,
      });
    }
  };
  return (
    <>
      <div className="item_wrap">
        {
          boardState?.foundBoards
            .slice(itemNumber.minValue, itemNumber.maxValue)
            .map((board, index) => {
              return (
                <ItemCards key={index} board={board} spaces={spaceState.spaces} socket={socket}/>
              );
            })
        // boardState.boards && searchInput === "" ? (
        //   boardState.boards.map((board, index) => {
        //     return <ItemCards key={index} board={board} spaces={spaceState.spaces} socket={socket}/>;
        //   })
        // ) : boardState.boards && searchInput.length > 0 ? (
        //   /* foundBoards */
        //   foundBoards.map((board, index) => {
        //     return <ItemCards key={index} board={board} spaces={spaceState.spaces} socket={socket}/>;
        //   })
        // ) : (
        //   <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        // )
        }
      </div>
      <br />

      <div className="pagination_wrap">
        <Pagination
          total={boardState.boards.length}
          defaultCurrent={1}
          defaultPageSize={4}
          // showSizeChanger
          // showQuickJumper
          showTotal={(total) => `Total ${total} items`}
          responsive={true}
          onChange={onChangePage}
        />
      </div>
    </>
  );
};

export default OwnedBoardTab;
