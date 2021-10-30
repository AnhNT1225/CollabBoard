import React from "react";
import { Row, Col, Divider, Space } from "antd";
import { BulbOutlined } from "@ant-design/icons";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/PageFooter";
import "./styles.scss";
const AboutUs = () => {
	return (
		<>
			<NavBar />
			<div className="container">
				<div className="content_wrap">
					<h1 className="services_title" style={{ textAlign: "center" }}>
						About Collab Board
					</h1>
					<div className="shorter_divider" style={{ width: 400 }}>
						<Divider type="horizontal">
							<BulbOutlined style={{ fontSize: 20, color: "yellow" }} />
						</Divider>
					</div>
					<br />
					<h3 style={{ textAlign: "center" }}>Our purpose?</h3>
					<section>
						Collab complements video conferencing for remote teams, the way a
						real whiteboard complements an office or meeting room. It is simple
						enough for anyone to pick up and use during a video meeting and
						supports brainstorming and discussion without breaking the flow of
						ideas. Collab is fast enough to feel tactile, like you're drawing on
						a real whiteboard, and fast enough to collaborate in real time while
						you're chatting with your colleagues.
					</section>
					<br />
					<section>
						We are a technology development firm whose mission is to create
						brilliant social applications that enable and empower teams of
						people who wish to collaborate, communicate and create whether or
						not they are in the same room.
					</section>
				</div>
				{/* <div className="services_content">
					<Row>
						<Space direction="vertical">
							<Col>The contact: 0979550476</Col>
							<Col>The hotline: 0909 2222</Col>
						</Space>
					</Row>
				</div> */}
				<Footer />
			</div>
		</>
	);
};

export default AboutUs;
