import { createContext, useReducer, useMemo } from "react";

export const MessageContext = createContext();
const initialState = {
  messages: [],
  isFetch: false,
  hasError: false,
  message: {},
};

const messageReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES_REQUEST":
      return {
        ...state,
        isFetch: true,
        hasError: false,
      };
    case "FETCH_MESSAGE_SUCCESS":
      return {
        ...state,
        isFetch: false,
        hasError: false,
        messages: action.payload
      };
    case "ADD_NEW_MESSAGE":
      return {
        messages: [...state.messages, action.payload]
      }
    default:
      return state;
  }
};
export const MessageProvider = ({ children }) => {
  const [messageState, messageDispatch] = useReducer(
    messageReducer,
    initialState
  );

  const messageContextValue = useMemo(() => {
    return { messageState, messageDispatch };
  }, [messageState, messageDispatch]);
  return (
    <MessageContext.Provider value={messageContextValue}>
      {children}
    </MessageContext.Provider>
  );
};
