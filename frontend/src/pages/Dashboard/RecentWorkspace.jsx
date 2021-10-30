import React, { useContext, useEffect } from "react";
import { BoardContext } from "../../context/boardContext";
import BoardService from "../../services/boardService";
import ItemCard from '../../components/ItemCards/ItemCard'
const RecentWorkspace = () => {
  const { boardState, boardDispatch } = useContext(BoardContext);
  useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    BoardService.getLastestBoard()
      .then((result) => {
        console.log("lastest boards: ", result);
        boardDispatch({ type: "FETCH_BOARDS_SUCCESS", payload: result.data });
      })
      .catch((error) => {
        console.log("error: ", error);
        boardDispatch({type: "FETCH_DATA_FAILURE"})
      });
  }, []);

  return (
    <div>
      <h2>Recently workspace</h2>
      <div className='recently_workspace_wrap'>
      {
          boardState?.boards.map((board, index) => {
              return(
              <ItemCard key={index} board={board}/>
              )
          })
      }
      </div>
    </div>
  );
};

export default RecentWorkspace;
