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
	let { setIsChatOpen, appHistoryStep, appHistory, elementDispatch } = props;
	console.log('APP STATE: ',appHistory);
	console.log('APP STEP: ',appHistoryStep);

	function handleUndo() {
		if (appHistoryStep === 0) {
			return;
		}
		console.log("on ok")
		appHistoryStep -= 1;
		console.log('APP STEP AFTER: ',appHistoryStep);
		if(appHistory[appHistoryStep].type === 'line'){
			elementDispatch({type: "REMOVE_LINE", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'rect'){
			elementDispatch({type: "REMOVE_RECTANGLE", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'ellipse'){
			elementDispatch({type: "REMOVE_ELLIPSE", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'polygons'){
			elementDispatch({type: "REMOVE_POLYGONS", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'star'){
			elementDispatch({type: "REMOVE_STAR", payload: appHistory[appHistoryStep]})
		}

	}

	function handleRedo() {
		if (appHistoryStep === appHistoryStep.length - 1) {
			return;
		}
		console.log()
		appHistoryStep += 1;
		console.log("test app his: ", appHistory[appHistoryStep])
		// create everything from scratch
		if(appHistory[appHistoryStep].type === 'line'){
			elementDispatch({type: "CREATE_LINE", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'rect'){
			elementDispatch({type: "CREATE_RECTANGLE", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'ellipse'){
			elementDispatch({type: "CREATE_ELLIPSE", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'polygons'){
			elementDispatch({type: "CREATE_POLYGONS", payload: appHistory[appHistoryStep]})
		}
		if(appHistory[appHistoryStep].type === 'star'){
			elementDispatch({type: "CREATE_STAR", payload: appHistory[appHistoryStep]})
		}

	}

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
					onClick={handleRedo}
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
