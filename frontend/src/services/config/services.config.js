import axios from "axios";
const apiUrl = "http://localhost:5000/api";
const token = localStorage.getItem("token");
export default axios.create({
	baseURL: apiUrl,
	headers: {
		"Content-type": "application/json",
	},
});
// const createAxios = () => {
// 	axios.interceptors.request.use(
// 		(config) => {
// 			const { origin } = new URL(config.url);
// 			const allowedOrigins = [apiUrl];
// 			const token = localStorage.getItem("user");
// 			if (allowedOrigins.includes(origin)) {
// 				config.headers.authorization = `Bearer ${token}`;
// 			}
// 			return config;
// 		},
// 		(error) => {
// 			return Promise.reject(error);
// 		}
// 	);
// };

// export default createAxios;
