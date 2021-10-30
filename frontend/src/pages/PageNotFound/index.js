import React from "react";
import { Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./styles.scss";
function NotFound(props) {
	return (
		// <div className="not-found">
		// 	<lottie-player
		// 		className="page_animation"
		// 		src="https://assets8.lottiefiles.com/packages/lf20_afwjhfb2.json"
		// 		background="transparent"
		// 		speed="1"
		// 		width="50px"
		// 		height="50px"
		// 		loop
		// 		autoplay
		// 	/>
		// 	<h1 className="page_title">
		// 		Sorry, the page you visited does not exist.
		// 	</h1>
		// 	<Button type="dashed" size="large" prefix={<HomeOutlined />}>
		// 		HOME
		// 	</Button>
		// </div>
		<div className="not-found">
			<img
				src="https://www.pngitem.com/pimgs/m/561-5616833_image-not-found-png-not-found-404-png.png"
				alt="not-found"
			/>
			<Link to={"/"} className="link-home">
				<Button type="primary">Go Home</Button>
			</Link>
		</div>
	);
}

export default NotFound;
