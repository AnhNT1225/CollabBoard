import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Button, Tooltip, message } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import "./style.scss";
import BoardService from "../../services/boardService";
// import { BoardContext } from "../../context/boardContext";
import { socket } from "../../services/socketServices";
const SearchRoom = () => {
	const history = useHistory();
	const [code, setCode] = useState(null);

	console.log("your socket is: ", socket);

	const onNotification = async (joinData) => {
		console.log("join data: ", joinData);
		message.success(joinData.message);
	};
	useEffect(() => {
		// socket.on("connect", () => {
		// 	console.log("socket current id: ", socket?.id);
		// 	console.log("Successfully connected from client!");
		// });

		socket.on("notification", onNotification);

		return () => {
			socket.off("notification", onNotification);
		};
	}, [socket]);
	const location = useLocation().search;
	console.log("location : ", location);

	// useEffect(() => {
	// 	const params = new URLSearchParams();
	// 	if (code) {
	// 		params.append("code", code);
	// 		BoardService.findBoardByCode(code)
	// 			.then(async (result) => {
	// 				console.log("result: ", result);
	// 				await socket.emit("join-room", code);
	// 				// history.push(`/board/${result.data._id}`);
	// 			})
	// 			.catch((error) => {
	// 				console.log("err: ", error);
	// 			});
	// 	} else {
	// 		params.delete("code");
	// 	}
	// 	history.push({ search: params.toString() });
	// }, [code, history]);

	const changeBoardCode = async (e) => {
		const codeRoom = await e.target.value;
		setCode(codeRoom);
	};

	const submitCode = async (e) => {
		e.preventDefault();
		console.log("YOUR CODE IS: ", code);

		await BoardService.findBoardByCode(code)
			.then(async (result) => {
				console.log("result: ", result);
				await socket.emit("join-room", result.data.code);
				history.push(`/board/${result.data._id}`);
			})
			.catch((error) => {
				console.log("err: ", error);
			});

		// setCode("");
	};

	return (
		<div className="search_wrap">
			<form className="code_frm" onSubmit={submitCode}>
				<Input
					type="text"
					id="board_code"
					name="board_code"
					placeholder="ENTER CODE"
					onChange={changeBoardCode}
					required
				/>
				<Tooltip title="search">
					<Button
						type="primary"
						htmlType="submit"
						style={{ width: 50 }}
						icon={
							<SearchOutlined style={{ alignSelf: "center", fontSize: 19 }} />
						}
					/>
				</Tooltip>
			</form>
		</div>
	);
};

export default SearchRoom;
