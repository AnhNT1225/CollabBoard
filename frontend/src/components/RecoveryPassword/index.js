import React from "react";
import "./style.scss";
const RecoveryPassword = () => {
	return (
		<>
			<header>
				<button>Back</button>
			</header>
			<main>
				<img src="/assets/logo_background.png" alt="logo" />
				<h1>Forgot your password?</h1>
				<b>We will have you reset it and get back on track.</b>
				<br />
				<form>
					<label htmlFor="recovery_email">Email address</label>
					<input className="input" name="recovery_email" />
					<br />
					<button type="submit">Reset password</button>
					<a href="/">Back to login</a>
				</form>
			</main>
		</>
	);
};

export default RecoveryPassword;
