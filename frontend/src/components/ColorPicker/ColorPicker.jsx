import React from "react";
import "./ColorPicker.scss";
const ColorPicker = (props) => {
	const { setColor, mainColors } = props;
	const handleChangeColor = (e) => {
		// console.log("color: ", e.target.id);
		let color = e.target.name;
		setColor(color)
	};
	return (
		<div className="color_types">
			{mainColors.map((color, index) => {
				return(
					<button
					key={index}
					className="color_btn"
					id={color.name}
					name={color.type}
					onClick={handleChangeColor}
			/>
				)
			})}
			{/* <button
				className="color_btn"
				id="red"
				name="red"
				onClick={handleChangeColor}
			/>
			<button
				className="color_btn"
				id="green"
				name="green"
				onClick={handleChangeColor}
			/>
			<button
				className="color_btn"
				id="blue"
				name="blue"
				onClick={handleChangeColor}
			/>
			<button
				className="color_btn"
				id="yellow"
				name="yellow"
				onClick={handleChangeColor}
			/>
			<button
				className="color_btn"
				id="brown"
				name="brown"
				onClick={handleChangeColor}
			/>
			<button
				className="color_btn"
				id="pink"
				name="pink"
				onClick={handleChangeColor}
			/>
			<button
				className="color_btn"
				id="black"
				name="black"
				onClick={handleChangeColor}
			/> */}
		</div>
	);
};

export default ColorPicker;
