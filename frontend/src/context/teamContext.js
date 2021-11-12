import { createContext, useReducer, useMemo } from "react";

export const TeamContext = createContext();
const initialState = {
  teams: [],
  isFetch: false,
  hasError: false,
  team: {},
  newTeams: []
};

const teamReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_TEAMS_REQUEST":
      return {
        ...state,
        isFetch: true,
        hasError: false,
      };
    case "FETCH_TEAM_SUCCESS":
      return {
        ...state,
        isFetch: false,
        team: action.payload,
      };
    case "FETCH_TEAMS_SUCCESS":
      return {
        ...state,
        isFetch: false,
        teams: action.payload,
      };
    case "FETCH_TEAMS_FAILURE":
      return {
        ...state,
        hasError: true,
        isFetch: false,
      };
    case "CREATE_TEAM":
      return {
        ...state,
        teams: [...state.teams, action.payload],
      };
    case "DELETE_TEAM":
      return {
        ...state,
        teams: state.teams.filter((team) => team._id !== action.payload),
      };
    case "UPDATE_TEAM_NAME":
      return {
        ...state,
        teams: (state.teams.find(
          (team) => team._id === action.payload._id
        ).name = action.payload.name),
      };

      //remove team member from current team
    case "REMOVE_TEAM_MEMBER":
      return {
        ...state,
        team: state.team.members.filter((member) => member._id !== action.payload),
      };
    case "SET_NEW_TEAM":
      return {
        ...state,
        newTeams: action.payload
      }
    default:
      return state;
  }
};
export const TeamProvider = ({ children }) => {
  const [teamState, teamDispatch] = useReducer(teamReducer, initialState);

  const teamContextValue = useMemo(() => {
    return { teamState, teamDispatch };
  }, [teamState, teamDispatch]);
  return (
    <TeamContext.Provider value={teamContextValue}>
      {children}
    </TeamContext.Provider>
  );
};
