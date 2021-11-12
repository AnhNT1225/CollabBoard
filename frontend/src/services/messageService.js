import axios from "axios";
import { getToken } from "../lib/auth";
// const API_URL = "http://localhost:5000/api/messages";
const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/messages`;

class MessageService {
  addNewMessage(boardId, message) {
    return axios
      .post(API_URL + `/${boardId}`, {message: message}, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  getMessage(boardId) {
    return axios
      .get(API_URL + `/${boardId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }

  deleteMessages(boardId){
    return axios
      .delete(API_URL + `/${boardId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log("err: ", error);
      });
  }
}

export default new MessageService();
