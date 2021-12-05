import { createContext, useMemo, useReducer } from "react";
export const ACTIONS = {
  LOGIN: "LOGIN",
  LOGIN_API: "LOGIN_API",
  LOGOUT: "LOGOUT",
  GET_USER: "GET_USER",
};
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isAdmin: false,
  users: [],
  newUsers: [],
};
export const UserContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log('payload: ', action.payload)
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

    case "LOGIN_API":
      if (action.payload.user.role === "admin") {
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
          token: action.payload.token,
          isAdmin: true,
        };
      }
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
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
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    case "SET_ALL_USER":
      return {
        ...state,
        users: action.payload,
      };
    case "SET_NEW_USER":
      return {
        ...state,
        newUsers: action.payload,
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
