import axios from "axios";
import { getToken } from "../lib/auth";
// const API_URL = "http://localhost:5000/api/team";
const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/team`;
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

  getNewTeams(){
    return axios
    .get(API_URL + "/new", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("err: ", error);
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

  addBoardToTeam(teamId, boardName) {
    return axios
      .patch(
        API_URL + `/update/boards/${teamId}`,
        { boardName: boardName },
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

  addSpaceToTeam(teamId, spaceName) {
    console.log("team id: ", teamId);
    console.log("spaceName: ", spaceName);
    return axios
      .patch(
        API_URL + `/update/spaces/${teamId}`,
        { spaceName: spaceName },
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
  //-----------------------------REMOVE SPACE FROM TEAM ----------------------------
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

 //-----------------------------REMOVE MEMBER FROM TEAM ----------------------------
  removeMemberFromTeam(teamId, selectedMemberId){
    console.log("selectedMemberId: ", selectedMemberId);

    return axios
      .patch(
        API_URL + `/remove/members/${teamId}`,
        { selectedMemberId: selectedMemberId },
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
