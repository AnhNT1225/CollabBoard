import React, { useContext } from "react";
import "./styles.scss";
import { Link, useHistory } from "react-router-dom";
import SearchRoom from "../SearchRoom/SearchRoom";
import Logo from "../Logo";
import { ACTIONS, UserContext } from "../../context/userContext";
import { Dropdown, Col, Row, Button, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

const NavBar = (props) => {
	const history = useHistory();
	const { state, dispatch } = useContext(UserContext);
	const logout = () => {
		dispatch({ type: ACTIONS.LOGOUT });
		history.replace("/");
	};
	const menu = (
		<Menu className="dropdown_menu">
			<Menu.Item key="0" className="dropdown_item">
				<Link to={"/user"}>Manage account</Link>
			</Menu.Item>
			{/* <Menu.Divider /> */}
			<Menu.Item key="1" className="dropdown_item" onClick={logout}>
				<i class="fas fa-sign-out-alt">Sign out</i>
			</Menu.Item>
		</Menu>
	);
	return (
		<div className="navbar">
			<Row justify="space-between">
				<Col span={3}>
					<Logo />
				</Col>
				<Col span={3}>
					<SearchRoom />
				</Col>
				<Col span={12}>
					<nav className="navbar navbar-expand-lg navbar-light ">
						<button
							className="navbar-toggler"
							type="button"
							data-toggle="collapse"
							data-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon"></span>
						</button>
						<div
							className="collapse navbar-collapse"
							id="navbarSupportedContent"
						>
							<ul className="navbar-nav me-auto mb-2 mb-lg-0">
								{/* <li className="nav-item">
							<Logo />
						</li>
						<li className="nav-item">
							<SearchRoom />
						</li> */}
								<li className="nav-item">
									<Link
										to={"/"}
										data-toggle="collapse"
										data-target=".navbar-collapse.show"
									>
										Document
									</Link>
								</li>
								{state.isAuthenticated ? (
									<li className="nav-item">
										<Link
											to={"/dashboard"}
											data-toggle="collapse"
											data-target=".navbar-collapse.show"
										>
											Dashboard
										</Link>
									</li>
								) : null}

								<li className="nav-item">
									<Link
										to={"/about"}
										data-toggle="collapse"
										data-target=".navbar-collapse.show"
									>
										About
									</Link>
								</li>

								{state.isAuthenticated ? (
									<li className="nav-item">
										<Dropdown overlay={menu} trigger={["click"]}>
											<Button shape="round" onClick={(e) => e.preventDefault()}>
												<p>
													{state.user && state.user.name} <DownOutlined />
												</p>
											</Button>
										</Dropdown>
									</li>
								) : (
									<>
										<li className="nav-item">
											<Link to={"/login"} className="nav-link">
												Log In
											</Link>
										</li>
										<li>
											<Link to={"/register"} className="nav-link">
												<Button
													shape="round"
													style={{background: "#ffffff"}}
													width={100}
													height={50}
												>Signup</Button>
											</Link>
										</li>
									</>
								)}
							</ul>
						</div>
					</nav>
				</Col>
			</Row>
		</div>
	);
}

export default NavBar;
