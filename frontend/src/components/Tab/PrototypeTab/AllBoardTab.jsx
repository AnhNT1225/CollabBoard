import React, { useContext, useEffect, useState } from "react";
import { Empty, Pagination } from "antd";
import ItemCards from "../../ItemCards/ItemCard";
import { BoardContext } from "../../../context/boardContext";
import { SpaceContext } from "../../../context/spaceContext";
import BoardService from "../../../services/boardService";
import "./styles.scss";
// import BoardService from "../../../../services/boardService";
const AllBoardTab = (props) => {
  const { searchInput, getJoinedItems, getSpaceLists, socket } = props;
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);

  const [itemNumber, setItemNumber] = useState({ minValue: 0, maxValue: 4 });
  useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    // getJoinedItems();
    BoardService.getJoinedBoard()
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
  }, []);

  useEffect(() => {
    spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
    getSpaceLists();
  }, []);

  console.log("boards log: ", boardState.boards);
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
          defaultPageSize={4}
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
