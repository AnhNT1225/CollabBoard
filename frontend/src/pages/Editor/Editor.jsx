import React, { useState, useEffect, useContext } from "react";
import "./style.scss";
import {withRouter} from 'react-router-dom'
import Board from "../../components/Board/Board";
import BoardService from "../../services/boardService";
import {message} from 'antd'
import { UserContext, ACTIONS } from "../../context/userContext";
import { BoardContext } from "../../context/boardContext";
import UserService from "../../services/userService";
import BoardHeader from "../../components/BoardHeader/BoardHeader";
const Editor = ({match, socket, location}) => {
	const { state, dispatch } = useContext(UserContext);
	const {  boardState, boardDispatch } = useContext(BoardContext);
	const boardId = match.params.id;
	console.log('boardId: ', boardId);
	console.log('editor socket: ', socket)
	console.log('state props history: ', location.state)

	useEffect(() => {
		const onNotification = (joinData) => {
			console.log("join data: ", joinData);
			message.success(joinData);
		  };
	  
		  socket?.on("notification", onNotification);
		return () => {
			socket?.off("notification", onNotification);
		}
	}, [socket])
	useEffect(() => {
		boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
		BoardService.getBoard(boardId)
			.then((response) => {
				console.log("response at editor: ", response);
				boardDispatch({ type: "FETCH_CURRENT_BOARD_SUCCESS", payload: response.data });
			})
			.catch((error) => {
				console.log("err: ", error);
				boardDispatch({ type: "FETCH_DATA_FAILURE" });
			});
	}, [boardDispatch, boardId]);

	useEffect(() => {
		UserService.getCurrentUser()
			.then((response) => {
				dispatch({ type: ACTIONS.GET_USER, payload: response });
				// console.log("user response data: ", response.data);
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	}, []);

	const [menuComponent, setMenuComponent] = useState("usePointer");
	console.log(menuComponent);

	const [drawingProperty, setDrawingProperty] = useState({
		brushColor: "#000000",
		brushStroke: 1,
		brushCap: "round",
	});
	// console.log("drawing: ", drawingProperty);
	const [isEditText, setIsEditText] = useState(false);
	const [textProperty, setTextProperty] = useState({
		color: "black",
		size: 20,
	});

	// console.log("text: ", textProperty);
	// const [shapingProperty, setShapingProperty] = useState("");

	return (
		<div className="editor">
			<BoardHeader
				boardId={boardId}
				menuComponent={menuComponent}
				drawingProperty={drawingProperty}
				setDrawingProperty={setDrawingProperty}
				// setShapingProperty={setShapingProperty}
				setTextProperty={setTextProperty}
				user={state.user}
				isEditText={isEditText}
				setIsEditText={setIsEditText}
				boardState={boardState}
				boardDispatch={boardDispatch}
				socket={socket}
				/>
			<Board
				menuComponent={menuComponent}
				drawingProperty={drawingProperty}
				setDrawingProperty={setDrawingProperty}
				textProperty={textProperty}
				setMenuComponent={setMenuComponent}
				user={state.user}
				boardId={boardId}
				isEditText={isEditText}
				setIsEditText={setIsEditText}
				boardState={boardState}
				boardDispatch={boardDispatch}
				socket={socket}
				match={match}
			/>
		</div>
	);
};

export default withRouter(Editor) ;
