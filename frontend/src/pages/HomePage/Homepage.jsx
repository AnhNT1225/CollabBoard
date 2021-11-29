import React, {useEffect, useContext} from "react";
import { Button } from "antd";
import { UserContext, ACTIONS } from "../../context/userContext";
import UserService from '../../services/userService';
import "./style.scss";
import Footer from "../../components/PageFooter";
import NavBar from "../../components/NavBar/NavBar";
import banner from "../../assets/images/Microsoft-Whiteboard-Preview.png";
import workImg from "../../assets/images/creative_ideas.png";
import sketchImg from "../../assets/images/limnu1.PNG";
import collabImg from "../../assets/images/limnu2.PNG";
import brainStorm from "../../assets/images/limnu3.PNG";
const HomePage = ({socket}) => {
	const { dispatch } = useContext(UserContext);
	useEffect(() => {
		UserService.getCurrentUser()
			.then((response) => {
				dispatch({ type: ACTIONS.GET_USER, payload: response });
				// console.log("user response data: ", response.data);
			})
			.catch((error) => {
				console.log("error: ", error);
			});
	}, []);
	return (
		<div className="home">
			<NavBar socket={socket}/>
			<div className="content_wrap">
				<div className="content_1">
					<div className="introduction">
						<div className="introduction_content">
							<span>
								<h2>
									<i>Modern interior</i>
								</h2>
								<h1>Create your own design ideas</h1>
								<p>
								The idea of an online whiteboard is to provide teams with a whiteboard on which they can work digital, from everywhere when they are online.
								Online whiteboards can be used for the same purpose as a real whiteboard, but without the limitations of a real whiteboard. The latter is limited by space, the number of things which you can add (have you ever tried to put a video on a real whiteboard?) and is only available to the people which are in the same room
								</p>
								<h2>Collab Board -- Where to start new ideas!</h2>
							</span>
							<Button className="function_button" type="primary" size="large">
								<span>Get started</span>
							</Button>
							<p>
								Already have an account?<a href="/login"> Log in here →</a>
							</p>
						</div>
						<div className="introduction_banner">
							<img className="banner" src={banner} alt="introduct logo" />
						</div>
					</div>
				</div>
				<div className="content_2" id="services">
					<div className="services">
						<div>
							<div className="services_title">
								<i>
									<h2>What we do</h2>
								</i>
								<h1>Our service</h1>
							</div>
							<div className="services_content">
								<div>
									<div className="services_details">
										<div className="services_introduction">
											<h3 className="services_title">
												Free to exchange the ideas
											</h3>
											<p>
												Lorem ipsum, dolor sit amet consectetur adipisicing
												elit. Sint a quam fugiat deleniti, illo doloribus
												expedita sit animi quisquam, est ipsa minus quaerat
												perspiciatis vero reiciendis aliquam laboriosam ratione
												voluptatum!
											</p>
										</div>
										<div className="services_media">
											<img src={workImg} alt="drawing_board" />
										</div>
									</div>
								</div>
								<div>
									<div className="services_details">
										<div className="services_media">
											<img src={sketchImg} alt="sketch" />
										</div>
										<div className="services_introduction">
											<h3 className="services_title">Sketch</h3>
											<p>
												Collab Board allow you free form sketching and creating
												whatever you want with the available poweful tools.
											</p>
										</div>
									</div>
								</div>
								<div>
									<div className="services_details">
										<div className="services_introduction">
											<h3 className="services_title">Team Collaboration</h3>
											<p>
												Extremely experience with remotely work and connect to
												work together in realtime environment.
											</p>
										</div>
										<div className="services_media">
											<img src={collabImg} alt="collab" />
										</div>
									</div>
								</div>
								<div>
									<div className="services_details">
										<div className="services_media">
											<img src={brainStorm} alt="brainstorm" />
										</div>
										<div className="services_introduction">
											<h3 className="services_title">Brainstorm</h3>
											<p>
												Collab Board allow people to have free space (toi uu )
												for inventing new ideas
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default HomePage;
