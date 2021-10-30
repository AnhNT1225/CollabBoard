import React from "react";
import { Link } from "react-router-dom";
import appLogo from "../../assets/images/logo_background.png";
import "./styles.scss";
const Logo = () => {
	return (
		<>
			<div className="logo">
				<Link to={"/"}>
					<img id="app_logo" width={150} src={appLogo} alt="app_logo" />
				</Link>
			</div>
		</>
	);
};

export default Logo;
