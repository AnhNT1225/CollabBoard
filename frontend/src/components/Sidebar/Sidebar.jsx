import React from "react";
import Logo from "../Logo";
import SidebarItem from "./SideBarItem";

const SideBar = (props) => {
	return (
		<div className="sidebar">
			<Logo />
			<SidebarItem
			{...props}
			// active={index === activeItem}
			/>
		</div>
	);
};

export default SideBar;
