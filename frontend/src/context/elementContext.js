import React, { createContext, useReducer, useMemo } from "react";
export const ElementContext = createContext();

const initialState = {
  rectangles: [],
  polygons: [],
  ellipses: [],
  straightlines: [],
  stars: [],
  lines: [],
  notes: [],
  files: [],
  texts: [],
  appState: [],
  appHistoryStep: 0,
};
const elementReducer = (state, action) => {
  switch (action.type) {
    case "CREATE_RECTANGLE":
      console.log("action type: ", action.payload);
      return {
        ...state,
        rectangles: [...state.rectangles, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_SQUARE":
      return {
        ...state,
        rectangles: [...state.rectangles, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_ROUND":
      return {
        ...state,
        ellipses: [...state.ellipses, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_ELLIPSE":
      return {
        ...state,
        ellipses: [...state.ellipses, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_TRIANGLE":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_RHOMBUS":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_PENTAGON":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_HEXAGON":
      return {
        ...state,
        polygons: [...state.polygons, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_STAR":
      return {
        ...state,
        stars: [...state.stars, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };
    case "CREATE_LINE":
      return {
        ...state,
        lines: [...state.lines, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };

    case "CREATE_NOTE":
      return {
        ...state,
        notes: [...state.notes, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };

    case "CREATE_TEXT":
      return {
        ...state,
        texts: [...state.texts, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };

    case "CREATE_FILE":
      return {
        ...state,
        files: [...state.files, action.payload],
        appState: [...state.appState, action.payload],
        appHistoryStep: state.appHistoryStep + 1,
      };

    case "UPDATE_APP_STATE":
      const appArr = [...state.appState];
      const appIndex = appArr.findIndex((el) => el.id === action.payload.id);
      console.log("appIndex: ", appIndex);
      appArr.splice(appIndex, 1, action.payload);
      console.log("app State  after: ", appArr);
      return {
        ...state,
        appState: [...appArr],
      };

    case "REMOVE_APP_STATE":
      return {
        ...state,
        appState: state.appState.filter((el) => el.id !== action.payload.id),
        appHistoryStep: state.appHistoryStep - 1,
      };
      
    // case "SET_APP_STATE":
    //   return {
    //     ...state,
    //     appState: action.payload,
    //     appHistoryStep: state.appHistoryStep - 1,
    //   };
    case "SET_RECTANGLE":
      return {
        ...state,
        rectangles: action.payload,
      };
    case "SET_ELLIPSE":
      return {
        ...state,
        ellipses: action.payload,
      };
    case "SET_POLYGONS":
      return {
        ...state,
        polygons: action.payload,
      };
    case "SET_STAR":
      return {
        ...state,
        stars: action.payload,
      };
    case "SET_LINE":
      return {
        ...state,
        lines: action.payload,
      };
    case "SET_FILE":
      return {
        ...state,
        files: action.payload,
      };
    case "SET_NOTE":
      return {
        ...state,
        notes: action.payload,
      };
    case "SET_TEXT":
      return {
        ...state,
        texts: action.payload,
      };
    case "RESET_STATE":
      return {
        rectangles: [],
        polygons: [],
        ellipses: [],
        straightlines: [],
        stars: [],
        lines: [],
        notes: [],
        files: [],
        texts: [],
        appState: [],
        appHistoryStep: 0
      };
      case "REMOVE_RECTANGLE":
        return {
          ...state,
          rectangles: state.rectangles.filter((el) => el.id !== action.payload.id),
        };
      case "REMOVE_ELLIPSE":
        return {
          ...state,
          ellipses: state.ellipses.filter((el) => el.id !== action.payload.id),
        };
      case "REMOVE_POLYGONS":
        return {
          ...state,
          polygons: state.polygons.filter((el) => el.id !== action.payload.id),
        };
      case "REMOVE_STAR":
        return {
          ...state,
          stars: state.stars.filter((el) => el.id !== action.payload.id),
        };
      case "REMOVE_LINE":
        return {
          ...state,
          lines: state.lines.filter((el) => el.points !== action.payload.points),
        };
      case "REMOVE_FILE":
        return {
          ...state,
          files: state.files.filter((el) => el.id !== action.payload.id),
        };
      case "REMOVE_NOTE":
        return {
          ...state,
          notes: state.notes.filter((el) => el.id !== action.payload.id),
        };
      case "REMOVE_TEXT":
        return {
          ...state,
          texts: state.texts.filter((el) => el.id !== action.payload.id),
        };
    default:
      return state;
  }
};
export const ElementProvider = ({ children }) => {
  const [elementState, elementDispatch] = useReducer(
    elementReducer,
    initialState
  );

  const elementContextValue = useMemo(() => {
    return { elementState, elementDispatch };
  }, [elementState, elementDispatch]);
  
  return (
    <ElementContext.Provider value={elementContextValue}>
      {children}
    </ElementContext.Provider>
  );
};
