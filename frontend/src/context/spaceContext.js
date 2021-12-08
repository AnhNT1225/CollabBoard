import { createContext, useReducer, useMemo } from "react";

export const SpaceContext = createContext();
const initialState = {
  spaces: [],
  isFetch: false,
  hasError: false,
  space: {},
};

const spaceReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SPACES_REQUEST":
      return {
        ...state,
        isFetch: true,
        hasError: false,
      };
    case "FETCH_SPACES_SUCCESS":
      return {
        ...state,
        isFetch: false,
        spaces: action.payload,
      };
    case "FETCH_SPACE_SUCCESS":
      return {
        ...state,
        isFetch: false,
        space: action.payload,
      };
    case "FETCH_SPACES_FAILURE":
      return {
        ...state,
        hasError: true,
        isFetch: false,
      };
    case "CREATE_SPACE":
      return {
        ...state,
        spaces: [...state.spaces, action.payload],
      };
    case "DELETE_SPACE":
      return {
        ...state,
        spaces: state.spaces.filter((space) => space._id !== action.payload),
      };
    case "UPDATE_SPACE":
      const spaceArr = [...state.spaces];
      const spaceIndex = spaceArr.findIndex(
        (el) => el.id === action.payload.id
      );
      console.log("spaceIndex: ", spaceIndex);
      spaceArr.splice(spaceIndex, 1, action.payload);
      console.log("space State  after: ", spaceArr);
      return {
        ...state,
        spaces: [...spaceArr],
        space: action.payload,
      };
    // case "UPDATE_SPACE_MEMBER":
    //   const currentArr = [...state.spaces];
    //   const index = currentArr.findIndex(
    //     (el) => el.teamId === action.payload.teamId
    //   );
    //   console.log("index: ", index);
    //   currentArr.splice(index, 1, action.payload);
    //   console.log("space State  after: ", currentArr);
    //   return {
    //     ...state,
    //     spaces: [...spaceArr],
    //     space: action.payload,
    //   };
    // case "UPDATE_BOARD":
    // 	return {

    // 	}

    default:
      return state;
  }
};
export const SpaceProvider = ({ children }) => {
  const [spaceState, spaceDispatch] = useReducer(spaceReducer, initialState);

  const spaceContextValue = useMemo(() => {
    return { spaceState, spaceDispatch };
  }, [spaceState, spaceDispatch]);
  return (
    <SpaceContext.Provider value={spaceContextValue}>
      {children}
    </SpaceContext.Provider>
  );
};
