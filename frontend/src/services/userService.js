import axios from "axios";
import { getToken } from "../lib/auth";
// const API_URL = "http://localhost:5000/api/user";
const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/user`;
class UserService {
  async getCurrentUser() {
    // console.log("token: ", token);
    const response = await axios.get(API_URL + "/details", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log("the user data from API: ", response.data.user);
    return response.data.user;
  }

  async getUserById(userId) {
    // const adu =getToken();
//     console.log('adu: ', adu)
//     const token = adu.includes("") ? adu.slice(1, adu.length-1): getToken
// console.log('token lead: ', token)
//     console.log(API_URL + `/${userId}`)
//     console.log(`Bearer ${token}`)
    const response = await axios.get(API_URL + `/${userId}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log("the user data from API: ", response.data.user);
    return response.data;
  }

  //FOR ADMIN
  async getAllUser() {
    const response = await axios.get(API_URL + "/all", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log("the user data from API: ", response.data.user);
    return response.data;
  }
  //FOR ADMIN
  async getNewUser() {
    const response = await axios.get(API_URL + "/new", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    // console.log("the user data from API: ", response.data.user);
    return response.data;
  }

  async editUserInfo(formData) {
    const response = await axios.patch(API_URL + "/edit", formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-type": "multipart/form-data",
      },
    });
    return response.data;
  }

  async changePassword(password) {
    const response = await axios.patch(
      API_URL + "/edit/password",
      { password: password },
      {
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );
    // console.log("the user data from API: ", response.data.user);
    return response.data;
  }

  async deleteUser(userId){
    const token =getToken();
    console.log('token lead: ', token)
    const response = await axios.delete(API_URL + `/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // console.log("the user data from API: ", response.data.user);
    return response.data;
  }
}

export default new UserService();
