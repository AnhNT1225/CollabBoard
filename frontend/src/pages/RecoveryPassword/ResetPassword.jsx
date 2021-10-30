import { Input } from "antd";
import React from "react";

const ResetPassword = () => {
	return (
		<div className="reset_password">
			<form className="reset_form">
				<h2>Password Recovery</h2>
				<br />
				<label htmlFor="password">Enter your new password</label>
				<Input type="password" size="large" name="password" />
				<br />
				<button className="btn btn-primary" type="submit">
					Confirm
				</button>
			</form>
		</div>
	);
};

export default ResetPassword;
