import React, { useContext, useEffect } from "react";
import { Empty, Pagination } from "antd";
import ItemCards from "../../ItemCards/ItemCard";
import { BoardContext } from "../../../context/boardContext";
import {SpaceContext} from '../../../context/spaceContext';
const OwnedBoardTab = (props) => {
  const { searchInput, getOwnedItems, getSpaceLists } = props;
  const { boardState, boardDispatch } = useContext(BoardContext);
  const { spaceState, spaceDispatch } = useContext(SpaceContext);
  useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    getOwnedItems();
  }, []);

  useEffect(() => {
    spaceDispatch({ type: "FETCH_SPACES_REQUEST" });
    getSpaceLists();
  }, []);
  let foundBoards;
  if (searchInput) {
    foundBoards = boardState.boards.filter((board) => {
      return board.name.toLowerCase().includes(searchInput.toLowerCase());
    });
  }
  return (
    <>
      <div className="item_wrap">
        {boardState.boards && searchInput === "" ? (
          boardState.boards.map((board, index) => {
            return <ItemCards key={index} board={board} spaces={spaceState.spaces}/>;
          })
        ) : boardState.boards && searchInput.length > 0 ? (
          /* foundBoards */
          foundBoards.map((board, index) => {
            return <ItemCards key={index} board={board} spaces={spaceState.spaces}/>;
          })
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
      <br />

      <div className="pagination_wrap">
        <Pagination
          total={boardState.boards.length}
          defaultCurrent={1}
          showSizeChanger
          showQuickJumper
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </>
  );
};

export default OwnedBoardTab;
