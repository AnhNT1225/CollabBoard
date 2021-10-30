import React from "react";
import { Link } from "react-router-dom";
import "./styles.scss";

const SideBarItem = (props) => {
	// console.log("props: ", props)
	return (
		<>
		{props.sidebarItem.map((item, index) => {
			return(
			<Link key={index} to={item.link}>
			<div className="sidebar__item">
				<div className={`sidebar__item-inner `} tabIndex={0}>
					<i className={item.icon}></i>
					<span>{item.title}</span>
				</div>
			</div>
		</Link>)
		})}
		</>
	);
};

export default SideBarItem;
