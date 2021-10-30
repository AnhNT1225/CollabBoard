import { Input } from "antd";
import React from "react";
import "./styles.scss";
const ResetPassword = () => {
	return (
		<div className="forgot_password">
			<form className="forgot_form">
				<h2>Enter your email</h2>
				<br />
				<Input
					type="email"
					size="large"
					name="email"
					placeholder="your_name@gmail.com"
					required={true}
				/>
				<br />
				<button className="btn btn-primary" type="submit">
					Send
				</button>
			</form>
		</div>
	);
};

export default ResetPassword;
