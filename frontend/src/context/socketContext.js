import React, { createContext, useMemo, useReducer } from "react";
// import { io } from "socket.io-client";
// const token = JSON.parse(localStorage.getItem("token"));
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
// export const socket = io(
// 	SOCKET_URL
// 	// {
// 	// 	transportOptions: {
// 	// 		polling: {
// 	// 			extraHeaders: {
// 	// 				Authorization: `Bearer ${token}`,
// 	// 			},
// 	// 		},
// 	// 	},
// 	// }
// );

export const SocketContext = createContext();

// const socketReducer = (state, action) => {
// 	switch (action.type) {
// 		case "CONNECT_SOCKET":
// 			return (state = io(SOCKET_URL));
// 		case "CONNECT_SOCKET_BOARD":
// 			return (state = io(SOCKET_URL + "/boards"));
// 		// case "CREATE_ROOM":
// 		// 	console.log("ABC");
// 		// 	console.log("OUR SOCKET STATE ON CREATE: ", state);
// 		// 	state.emit("create-room", action.payload);
// 		// 	return state;
// 		// case "JOIN_ROOM":
// 		// 	console.log("XJKAHKJSHKJAHKJHKJS");
// 		// 	return state.emit("join-room", action.payload);
// 		// case "NOTIFICATION":
// 		// 	return state.emit("notification", action.payload);
// 		default:
// 			return state;
// 	}
// };

export const SocketProvider = ({ children }) => {
	// const [socketState, socketDispatch] = useReducer(
	// 	socketReducer,
	// 	initialSocket
	// );

	// const socketContextValue = useMemo(() => {
	// 	return { socketState, socketDispatch };
	// }, [socketState, socketDispatch]);
	return (
		<SocketContext.Provider value={null}>{children}</SocketContext.Provider>
	);
};
