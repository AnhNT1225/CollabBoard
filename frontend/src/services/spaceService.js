import axios from "axios";
import { getToken } from "../lib/auth";
const API_URL = "http://localhost:5000/api/space";

class SpaceService {
  createSpace(spaceName) {
    return axios
      .post(
        API_URL + "/create",
        { spaceName: spaceName },
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

  getJoinedSpaces() {
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

  //-----------------------------------------REMOVE CASE: GET OWNED SPACES-----------------
  getOwnedSpaces() {
  	return axios
  		.get(API_URL + "/owned", {
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
      .patch(API_URL + `/update/boards/${spaceId}`, spaceData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  removeBoardFromSpace(spaceId, boardId) {
    console.log("space id: ", spaceId);

    return axios
      .patch(
        API_URL + `/remove/boards/${spaceId}`,
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

  deleteSpace(spaceId) {
    return axios
      .delete(API_URL + `/delete/${spaceId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  getSpaceById(spaceId) {
    return axios
      .get(API_URL + `/${spaceId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  setTeamForSpace(spaceId, teamId) {
    return axios
      .patch(
        API_URL + `/update/team/${spaceId}`,
        { teamId: teamId},
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

  updateSpaceInfo(spaceId, form){
    return axios
    .patch(
      API_URL + `/update/${spaceId}`,
      form,
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

export default new SpaceService();
