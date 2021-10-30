import { createContext, useMemo, useReducer } from "react";
export const ACTIONS = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  GET_USER: "GET_USER",
};
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isAdmin: false,
  users: [],
};
export const UserContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      if (action.payload.user.role === "admin") {
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.accessToken,
          isAdmin: true,
        };
      }
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.accessToken,
        isAdmin: false,
      };

    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "GET_USER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };

    case "SET_ALL_USER":
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const userContextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);
  return (
    <UserContext.Provider value={userContextValue}>
      {children}
    </UserContext.Provider>
  );
};
