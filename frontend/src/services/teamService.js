import axios from "axios";
import { getToken } from "../lib/auth";
const API_URL = "http://localhost:5000/api/team";

class TeamService {
  createTeam(teamName) {
    return axios
      .post(
        API_URL + "/create",
        { teamName: teamName },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  }

  getAllTeams() {
    return axios
      .get(API_URL + "/all", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  getTopTeams() {
    return axios
      .get(API_URL + "/top5", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  getJoinedTeam() {
    return axios
      .get(API_URL + "/joined", {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  addBoardToSpace(spaceId, dataInput) {
    console.log("space id: ", spaceId);
    const spaceData = {
      spaceName: dataInput.spaceName,
      boardId: dataInput.boardId,
    };
    return axios
      .patch(API_URL + `/update/${spaceId}`, spaceData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  editTeamName(teamId, team_name) {
    return axios
      .patch(
        API_URL + `/update/name/${teamId}`,
        { team_name: team_name },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  deleteTeam(teamId) {
    return axios
      .delete(API_URL + `/delete/${teamId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  getTeamById(teamId) {
    return axios
      .get(API_URL + `/${teamId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  addBoardToTeam(teamId, boardId) {
    return axios
      .patch(
        API_URL + `/update/boards/${teamId}`,
        { boardId: boardId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  addSpaceToTeam(teamId, spaceId) {
    console.log("team id: ", teamId);
    console.log("bbbbb id: ", spaceId);
    return axios
      .patch(
        API_URL + `/update/spaces/${teamId}`,
        { spaceId: spaceId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  addMemberToTeam(teamId, memberEmail) {
    console.log("team id: ", teamId);
    console.log("bbbbb email: ", memberEmail);
    return axios
      .patch(
        API_URL + `/update/members/${teamId}`,
        { memberEmail: memberEmail },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  removeSpaceFromTeam(spaceId, teamId) {
    console.log("space id: ", spaceId);

    return axios
      .patch(
        API_URL + `/remove/spaces/${teamId}`,
        { spaceId: spaceId },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }
}

export default new TeamService();
