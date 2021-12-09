import React, {useRef} from "react";
import { Button, message } from 'antd';
import { CopyOutlined } from "@ant-design/icons";
import './sharecontent.scss'
const ShareContent = (props) => {
	const { currentBoard } = props;
	const codeShareRef = useRef(currentBoard.code)
	
	
	const copyClipboard = (e) =>{
		 /* Get the text field */
		let copyText = codeShareRef.current
		console.log('copy.text: ', copyText)
		 /* Select the text field */
		//  copyText.select();
		//  copyText.setSelectionRange(0, 99999); /* For mobile devices */
	   
		  /* Copy the text inside the text field */
		 navigator.clipboard.writeText(copyText);
	   
		 /* Alert the copied text */
		 message.success({
			content: 'Copied the board code to clipboard',
			className: 'custom-class',
			// style: {
			//   marginTop: '20vh',
			//   marginLeft: "50vw"
			// },
		  });
	}


	return (
		<>
			<div className="invitation_wrap">
			<h4>This is the access board code</h4>
			<input type="text" value={codeShareRef.current} id="share_code" readOnly={true}/>
			<Button htmlType='button' type="text" icon={<CopyOutlined />} onClick={copyClipboard}/>
			</div>
		</>
	);
};

export default ShareContent;
