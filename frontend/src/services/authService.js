import axios from "axios";
// import GoogleLogin from "react-google-login";
// import authHeader from "./auth-header";
// const BASE_URL = "http://localhost:5000";
// const API_URL = "http://localhost:5000/api/board";
const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/auth`;
// axios.interceptors.request.use(
// 	(config) => {
// 		const token = localStorage.getItem("user");
// 		config.headers.authorization = `Bearer ${token}`;

// 		return config;
// 	},
// 	(error) => {
// 		return Promise.reject(error);
// 	}
// );
// const authAxios = axios.create({
// 	baseURL: API_URL,
// 	headers: {
// 		Authorization: `Bearer ${token}`,
// 	},
// });

class AuthService {
  login(accountInfo) {
    return axios
      .post(API_URL + "/login", accountInfo, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken);
          return response.data;
        }
      });
  }

  loginWithGoogle(googleTokenId) {
    return axios
      .post(
        API_URL + "/google/login",
        { code: googleTokenId },
        // {tokenId: googleTokenId},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("res google login: ", response.data);
        if (response.data.token) {
          localStorage.setItem("token", JSON.stringify(response.data.token));
          return response.data;
        }
      });
  }

  logout() {
    localStorage.removeItem("token");
  }

  register(signupInfo) {
    return axios.post(API_URL + "/register", signupInfo);
  }
}

export default new AuthService();
