import axios from "axios";
import { getToken } from "../lib/auth";

// const API_URL = "http://localhost:5000/api/board";
const API_URL = `${process.env.REACT_APP_SERVER_URL}/api/board`;


class BoardService {
	//create board without name
	createBoard(boardName) {
		return axios
			.post(
				API_URL + "/create",
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

	///FOR ADMIN GET ALL BOARD IN SYSTEM
	getAllBoard() {
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

	getNewBoards(){
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
	
	//FOR USER
	getJoinedBoard() {
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

	getOwnedBoard() {
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

	getBoard(boardId) {
		return axios
			.get(API_URL + `/${boardId}`, {
				headers: { Authorization: `Bearer ${getToken()}` },
				// params: { id: boardId },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}

	updateBoardName(boardId, boardName) {
		console.log("new board name update: ", boardName);
		// const boardData = {
		// 	board_name: boardInfo.name || null,
		// 	board_src: boardInfo.srcFile || null,
		// 	board_store: boardInfo.store || null,
		// };

		return axios
			.patch(
				API_URL + `/update/name/${boardId}`,
				{ board_name: boardName },
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

	updateBoardCanvas(boardId, boardInfo) {
		console.log("INPUT INFO update : ", boardInfo);
		// const boardData = {
		// 	board_src: boardInfo.imageURL,
		// 	// board_store: boardInfo.storage,
		// 	board_store: boardInfo.store,
		// 	board_media: boardInfo.media,
		// };

		return axios
			.patch(API_URL + `/update/canvas/${boardId}`, boardInfo, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}

	
	deleteBoard(boardId) {
		return axios
			.delete(API_URL + `/delete/${boardId}`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}

	findBoardByName(boardName) {
		return axios
			.get(API_URL, {
				params: { boardName: boardName },
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}

	findBoardByCode(boardCode) {
		return axios
			.patch(API_URL, {
				params: { boardCode: boardCode },
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}


	setSpaceForBoard(boardId, spaceId){
		return axios
			.patch(API_URL + `/update/space/${boardId}`, { spaceId: spaceId }, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}

	getLastestBoard(){
		return axios
			.get(API_URL + `/lastest`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	}

	leaveBoardById(){
		return axios
		.patch(API_URL + `/leave/:id`, {
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

export default new BoardService();
