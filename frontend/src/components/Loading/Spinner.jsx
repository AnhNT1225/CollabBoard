import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import "./styles.scss";
const Spinner = () => {
	return (
		<>
			<div className="global-spinner-overlay">
				<LoadingOutlined />
				<p>Loading ...</p>
			</div>
		</>
	);
};

export default Spinner;
