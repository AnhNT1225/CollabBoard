import { createContext, useReducer, useMemo } from "react";
// import BoardService from "../services/boardService";
export const BoardContext = createContext();
const initialState = {
  boards: [],
  isFetch: false,
  hasError: false,
  currentBoard: {},
  foundBoards: [],
  newBoards: [],
};

const boardReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_BOARDS_REQUEST":
      return {
        ...state,
        isFetch: true,
        hasError: false,
      };
    case "FETCH_CURRENT_BOARD_SUCCESS":
      // console.log("action payload: ", action.payload)
      return {
        ...state,
        isFetch: false,
        currentBoard: action.payload,
      };
    case "FETCH_BOARDS_SUCCESS":
      console.log("action payload: ", action.payload);
      return {
        ...state,
        isFetch: false,
        boards: action.payload,
        foundBoards: action.payload,
      };
    case "FETCH_DATA_FAILURE":
      return {
        ...state,
        hasError: true,
        isFetch: false,
      };
    case "CREATE_BOARD":
      return {
        ...state,
        boards: [...state.boards, action.payload],
        foundBoards: [...state.boards, action.payload]
      };
    case "REMOVE_BOARD":
      return {
        ...state,
        boards: state.boards.filter((board) => board._id !== action.payload),
        foundBoards: state.boards.filter(
          (board) => board._id !== action.payload
        ),
      };
    case "SET_CURRENT_BOARD":
      console.log("action payload: ", action.payload);
      return {
        ...state,
        currentBoard: action.payload,
      };

    case "UPDATE_BOARDS_INFO":
      const boardArr = [...state.boards];
      // state.boards.find((board) => board._id === action.payload._id).spaceId = action.payload.spaceId
      const boardIndex = boardArr.findIndex(
        (el) => el._id === action.payload._id
      );
      console.log("boardIndex: ", boardIndex);
      boardArr.splice(boardIndex, 1, action.payload);
      console.log("board State  after: ", boardArr);
      return {
        ...state,
        boards: [...boardArr],
        foundBoards: [...boardArr],
      };

    case "SEARCH_BOARD":
      console.log("search payload: ", action.payload);
      if (action.payload === "") {
        console.log("ok empty is true");
        return {
          ...state,
          foundBoards: state.boards,
        };
      }
      return {
        ...state,
        foundBoards: state.boards.filter((board) =>
          board.name.toLowerCase().includes(action.payload.toLowerCase())
        ),
      };

    case "SET_NEW_BOARD":
      return {
        ...state,
        newBoards: action.payload,
      };
    default:
      return state;
  }
};
export const BoardProvider = ({ children }) => {
  const [boardState, boardDispatch] = useReducer(boardReducer, initialState);

  // const [currentBoard, setCurrentBoard] = useState(null);

  // const updateBoard = async (boardId, boardInfo) => {
  // 	console.log("boardID: ", boardId, "BoardInfo: ", boardInfo);
  // 	await BoardService.updateBoard(boardId, boardInfo)
  // 		.then((response) => {
  // 			console.log("Board updated info: ", response);
  // 			setCurrentBoard(response);
  // 		})
  // 		.catch((error) => {
  // 			console.log("err: ", error);
  // 		});
  // };

  // const searchBoardByName = (boardName) => {
  // 		// return board.name.toLowerCase().indexOf(boardName) !== -1;
  // };

  const boardContextValue = useMemo(() => {
    return { boardState, boardDispatch };
  }, [boardState, boardDispatch]);
  return (
    <BoardContext.Provider value={boardContextValue}>
      {children}
    </BoardContext.Provider>
  );
};
