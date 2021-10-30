import React, { useRef } from "react";
import { Modal, Input, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Logo from "../Logo";
import { socket } from "../../services/socketServices";
import BoardService from "../../services/boardService";
import { useHistory } from "react-router-dom";
const JoinRoomModal = (props) => {
	const { joinRoomModal, setjoinRoomModal, setCreateBoardModal } = props;
	const history = useHistory();
	const inputRef = useRef(null);
	// console.log("test JoinRoomModal : ", joinRoomModal);
	const backToPrevious = () => {
		setjoinRoomModal(false);
		setCreateBoardModal(true);
	};

	const handleJoinRoom = async (e) => {
		e.preventDefault();
		console.log("iasjdsiajdi: ", inputRef.current);

		await BoardService.findBoardByCode(inputRef.current)
			.then(async (result) => {
				console.log("result: ", result);
				await socket.emit("join-room", result.data.code);
				history.push(`/board/${result.data._id}`);
			})
			.catch((error) => {
				console.log("err: ", error);
			});
	};
	return (
		<Modal
			visible={joinRoomModal}
			footer={null}
			onOk={() => setjoinRoomModal(false)}
			onCancel={() => setjoinRoomModal(false)}
			title={<ArrowLeftOutlined onClick={backToPrevious} />}
		>
			<form className="room_code_wrapper" onSubmit={handleJoinRoom}>
				<Logo />
				<section className="room_code_description">
					<b>Collaborate with others via Collab Board.</b>
					<p>
						Web participants of a <b>collaborative </b>session are able to{" "}
						<b>draw</b>, make <b> comments</b>, and <b>share</b> their ideas in{" "}
						<b>real-time</b>.
					</p>
				</section>
				<label className="room_code_label">
					<b>ENTER THE CODE TO JOIN A SESSION</b>
				</label>
				<Input
					ref={inputRef}
					style={{ width: 250, height: 50, textAlign: "center" }}
					placeholder="ENTER invite code"
					onChange={(e) => (inputRef.current = e.target.value)}
				/>
				<br />
				<Button
					htmlType="submit"
					type="primary"
					size="large"
					style={{ width: 200, borderRadius: 20, fontSize: " 1rem " }}
				>
					Join
				</Button>
			</form>
		</Modal>
	);
};

export default JoinRoomModal;
