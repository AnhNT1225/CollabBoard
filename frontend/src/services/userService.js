import axios from "axios";
import { getToken } from "../lib/auth";
const API_URL = "http://localhost:5000/api/user";

class UserService {
	async getCurrentUser() {
		// console.log("token: ", token);
		const response = await axios.get(API_URL + "/details", {
			headers: { Authorization: `Bearer ${getToken()}` },
		});
		// console.log("the user data from API: ", response.data.user);
		return response.data.user;
	}

	async getUserById(userId){
		const response = await axios.get(API_URL + `/${userId}`, {
			headers: { Authorization: `Bearer ${getToken()}` },
		});
		// console.log("the user data from API: ", response.data.user);
		return response.data;
	}

	async getAllUser(){
		const response = await axios.get(API_URL + '/all',  {
			headers: { Authorization: `Bearer ${getToken()}` },
		});
		// console.log("the user data from API: ", response.data.user);
		return response.data;
	}
	
	async editUserInfo(formData){
		const response = await axios.patch(API_URL + '/edit', formData, {
			headers: { Authorization: `Bearer ${getToken()}` },
		})
		return response.data
	}
}

export default new UserService();
