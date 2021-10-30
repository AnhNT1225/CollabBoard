import React from "react";
import { Button } from "antd";
import {
	UndoOutlined,
	// PlusOutlined,
	// MinusOutlined,
	MessageOutlined,
	RedoOutlined,
} from "@ant-design/icons";
import "./styles.scss";

function ControlMenu(props) {
	let { setIsChatOpen, appHistoryStep, appHistory } = props;

	function handleUndo() {
		if (appHistoryStep === 0) {
			return;
		}
		appHistoryStep -= 1;
		console.log("app his: ", appHistory[appHistoryStep]);
		// state = appHistory[appHistoryStep];
		// // create everything from scratch
		// create(state);
	}

	// function handleRedo() {
	// 	if (appHistoryStep === 0) {
	// 		return;
	// 	}
	// 	appHistoryStep -= 1;
	// 	state = appHistory[appHistoryStep];
	// 	// create everything from scratch
	// 	create(state);
	// }

	return (
		<>
			<div className="zoom_pan">
				<Button
					className="zoom_btn"
					size="large"
					type="text"
					icon={<UndoOutlined style={{ fontSize: 20 }} />}
					onClick={handleUndo}
				/>
				<Button
					className="zoom_btn"
					size="large"
					type="text"
					icon={<RedoOutlined style={{ fontSize: 20 }} />}
				/>
			</div>
			<div className="chat_pan">
				<Button
					className="chat_btn"
					size="large"
					icon={<MessageOutlined style={{ fontSize: 25 }} />}
					onClick={() => setIsChatOpen(true)}
				/>
			</div> 
		</>
	);
}

export default ControlMenu;
