import React, { useState } from "react";
import { Input, Button } from "antd";
import AuthService from "../../services/authService";
import { useHistory } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import "./styles.scss";
import NavBar from "../../components/NavBar/NavBar";

const Register = () => {
	const history = useHistory();
	const [form, setForm] = useState({});
	const [messageError, setMessageError] = useState([]);
	//Validate the password & confirm password is same or not
	const validatePassword = (password, confirmPassword) => {
		if (password !== confirmPassword) {
			setMessageError((prevState) => [
				...prevState,
				{ unduplicatedError: "Password and confirm password unmatched" },
			]);
		}
	};

	const handleSignup = (e) => {
		console.log("form result: ", form);
		e.preventDefault();
		const data = {
			email: form.email,
			name: form.name,
			password: form.password,
		};
		AuthService.register(data)
			.then((userInfo) => {
				history.push("/dashboard");
				console.log("returned data: ", userInfo);
				// window.location.reload();
			})
			.catch((error) => {
				console.log("error: ", error);
				// setIsLoading(false);
			});
		setForm({});
	};
	console.log("form: ", form);
	return (
		<div className="login">
			<NavBar />
			<div className="register_wrap">
				<form className="register_form" onSubmit={handleSignup}>
					<h2 className="title_form">Create an account</h2>
					<label className="input_label" htmlFor="name">
						Name
					</label>
					<Input
						className="register_input"
						size="middle"
						placeholder="Name"
						name="name"
						onChange={(e) =>
							setForm((prevState) =>
								setForm({ ...prevState, name: e.target.value })
							)
						}
						required
					/>
					<label className="input_label" htmlFor="email">
						Email
					</label>
					<Input
						className="register_input"
						size="middle"
						placeholder="Email"
						name="email"
						onChange={(e) =>
							setForm((prevState) =>
								setForm({ ...prevState, email: e.target.value })
							)
						}
						required
					/>

					<label className="input_label" htmlFor="password">
						Password
					</label>
					<Input.Password
						className="register_input"
						placeholder="Type password"
						name="password"
						iconRender={(visible) =>
							visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
						}
						onChange={(e) =>
							setForm((prevState) =>
								setForm({ ...prevState, password: e.target.value })
							)
						}
						required
					/>
					<label className="input_label" htmlFor="confirm_password">
						Confirm password
					</label>
					<Input.Password
						className="register_input"
						placeholder="Confirm pasword"
						name="confirm_password"
						iconRender={(visible) =>
							visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
						}
						onChange={(e) =>
							setForm((prevState) =>
								setForm({
									...prevState,
									confirmPassword: e.target.value,
								})
							)
						}
						required
					/>

					<Button
						className="button_form"
						type="primary"
						htmlType="submit"
						onClick={handleSignup}
						size="large"
					>
						Submit
					</Button>
				</form>
			</div>
		</div>
	);
};

export default Register;
