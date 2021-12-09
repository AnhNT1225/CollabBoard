import React, { useContext, useEffect, useState } from "react";
import { Empty, Pagination } from "antd";
import ItemCards from "../../ItemCards/ItemCard";
import { BoardContext } from "../../../context/boardContext";
import { SpaceContext } from "../../../context/spaceContext";
import BoardService from "../../../services/boardService";
import "./styles.scss";
// import BoardService from "../../../../services/boardService";
const AllBoardTab = (props) => {
  const { searchInput, getSpaceLists, socket, sortType} = props;
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);

  const [itemNumber, setItemNumber] = useState({ minValue: 0, maxValue: 12 });
  // useEffect(() => {
  //   boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
  //   BoardService.getJoinedBoard()
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
        return new Date(board.createdAt);
      })
      .sort(function (a, b) {
        return a - b;
      });
      // boardDispatch({type: 'FETCH_BOARDS_SUCCESS', payload: increase})
     console.log("increase: ", increase);
  } else if (sortType === "date_updated") {
    const decrease = boardState?.boards
      .filter((board) => {
        return new Date(board.updatedAt);
      })
      .sort(function (a, b) {
        return a - b;
      });
      // boardDispatch({type: 'FETCH_BOARDS_SUCCESS', payload: decrease})
    console.log("decrease: ", decrease);
  }

  useEffect(() => {
    spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
    getSpaceLists();
  }, []);

  console.log("all boards log: ", boardState.boards);
  //   let foundBoards;
  //   if (searchInput) {
  //     // foundBoards = boardState.boards.filter((board) => {
  //     // 	return board.name.toLowerCase().includes(searchInput.toLowerCase());
  //     // });
  //     boardDispatch({ type: "SEARCH_BOARD", payload: searchInput });
  //   }
  useEffect(() => {
    boardDispatch({ type: "SEARCH_BOARD", payload: searchInput });
  }, [searchInput, boardDispatch]);

  const onChangePage = (pageNumber, pageSize) => {
    console.log("Page: ", pageNumber);
    console.log("pageSize: ", pageSize);
    if (pageNumber <= 1) {
      setItemNumber({
        minValue: 0,
        maxValue: 12,
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
        {boardState?.foundBoards
          .slice(itemNumber.minValue, itemNumber.maxValue)
          .map((board, index) => {
            return (
              <ItemCards key={index} board={board} spaces={spaceState.spaces} socket={socket}/>
            );
          })}
      </div>
      <br />

      <div className="pagination_wrap">
        <Pagination
          total={boardState.boards.length}
          defaultPageSize={12}
          defaultCurrent={1}
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

export default AllBoardTab;
