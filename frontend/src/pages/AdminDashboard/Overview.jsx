import React, { useEffect, useContext, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import UserService from "../../services/userService";
import { UserContext } from "../../context/userContext";
import TeamService from "../../services/teamService";
import { TeamContext } from "../../context/teamContext";
import BoardService from "../../services/boardService";
import { BoardContext } from "../../context/boardContext";
import "./styles.scss";
const Overview = () => {
  const { state, dispatch } = useContext(UserContext);
  const { teamState, teamDispatch } = useContext(TeamContext);
  const { boardState, boardDispatch } = useContext(BoardContext);
  const [topTeam, setTopTeam] = useState([]);
  useEffect(() => {
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getAllTeams()
      .then((response) => {
        console.log("all team: ", response.data);
        teamDispatch({ type: "FETCH_TEAMS_SUCCESS", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    const filterTeam = teamState.teams.filter((team) => {
      // console.log('team chick : ', team)
      return team.boards.length > 0 && team.members.length>0})
        .sort(function (a, b) {
          return b - a;
        }).slice(0, 5);
    setTopTeam(filterTeam)
    console.log("filterTeam: ", filterTeam);
  }, [teamState.teams]);
  useEffect(() => {
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getTopTeams()
      .then((response) => {
        console.log("top team: ", response.data);
        teamDispatch({ type: "SET_TOP_TEAM", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
    BoardService.getAllBoard()
      .then((response) => {
        console.log("all board: ", response.data);
        boardDispatch({ type: "FETCH_BOARDS_SUCCESS", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    UserService.getAllUser()
      .then((response) => {
        console.log("all user: ", response.data);
        dispatch({ type: "SET_ALL_USER", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    UserService.getNewUser()
      .then((response) => {
        console.log("all user: ", response.data);
        dispatch({ type: "SET_NEW_USER", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    TeamService.getNewTeams()
      .then((response) => {
        console.log("teams: ", response.data);
        teamDispatch({ type: "SET_NEW_TEAM", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  useEffect(() => {
    BoardService.getNewBoards()
      .then((response) => {
        console.log("boards: ", response.data);
        boardDispatch({ type: "SET_NEW_BOARD", payload: response.data });
        // console.log("user response data: ", response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }, []);

  const userData = {
    labels: ["New", "Total"],
    datasets: [
      {
        label: "# of Votes",
        data: [state?.newUsers.length, state?.users.length],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const teamData = {
    labels: ["New", "Total"],
    datasets: [
      {
        label: "New team percentage",
        data: [teamState?.newTeams.length, teamState?.teams.length],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const boardData = {
    labels: ["New", "Total"],
    datasets: [
      {
        label: "# of Votes",
        data: [boardState?.newBoards.length, boardState?.boards.length],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="recently-stats_wrap">
      <div className="recently_created">
        <div className="recently_stats">
          <p className="represent_chart_title">
            New user today: <b>{state?.newUsers.length}</b>
          </p>
          <div>
            <Doughnut
              className="chart"
              // width={300}
              // height={200}
              data={userData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="recently_stats">
          <p className="represent_chart_title">
            New board today: <b>{boardState?.newBoards.length}</b>
          </p>
          <div>
            <Doughnut
              className="chart"
              data={boardData}
              // width={300}
              // height={200}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="recently_stats">
          <p className="represent_chart_title">
            New team today: <b>{teamState?.newTeams.length}</b>
          </p>
          <div>
            <Doughnut
              className="chart"
              data={teamData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
      <div className="recently_board_chart">
        <div>
          <h5>Top 5 teams own the most boards</h5>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Members</th>
                <th scope="col">Boards</th>
              </tr>
            </thead>
            <tbody>
              {topTeam.map((team, index) => {
                return (
                  <tr>
                    <th scope="row">{index + 1}</th>
                    <td>{team.name}</td>
                    <td>{team.members.length}</td>
                    <td>{team.boards.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
