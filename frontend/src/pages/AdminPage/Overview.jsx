import React, {useEffect, useContext} from "react";
import { Doughnut } from "react-chartjs-2";
import UserService from "../../services/userService";
import { UserContext } from "../../context/userContext";
import TeamService from "../../services/teamService";
import { TeamContext } from "../../context/teamContext";
import "./styles.scss";
const Overview = () => {
  const { state, dispatch } = useContext(UserContext);
  const { teamState, teamDispatch } = useContext(TeamContext);
  useEffect(() => {
    teamDispatch({ type: "FETCH_TEAMS_REQUEST" });
    TeamService.getTopTeams()
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

  const percentageData = {
    labels: ["New", "Total"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, state?.users.length],
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
            New user: <b>15</b>
          </p>
          <div>
            <Doughnut
              className="chart"
              // width={300}
              // height={200}
              data={percentageData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="recently_stats">
          <p className="represent_chart_title">
            New board: <b>15</b>
          </p>
          <div>
          <Doughnut
            className="chart"
            data={percentageData}
            // width={300}
            // height={200}
            options={{ maintainAspectRatio: false }}
          />
          </div>
        </div>
        <div className="recently_stats">
          <p className="represent_chart_title">
            New team: <b>15</b>
          </p>
          <div>
          <Doughnut
            className="chart"
            data={percentageData}
            options={{ maintainAspectRatio: false }}
          />
          </div>
        </div>
      </div>
      <div className="recently_board_chart">
        <div>
            <h5>Top 5 teams own the most boards</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Members</th>
                  <th scope="col">Boards</th>
                </tr>
              </thead>
              <tbody>
                {teamState?.teams.map((team, index) => {
                  return (
                    <tr>
                      <th scope="row">{index+ 1}</th>
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
