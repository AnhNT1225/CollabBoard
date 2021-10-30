import React from "react";
import { BoldLineIcon, LightLineIcon, MediumLineIcon } from "../Icons";
import { Button } from "antd";
const LineWeight = (props) => {
	const { setLineWeight } = props;
	const changeLineWidth = (e) => {
		const lineType = e.currentTarget.id;
		switch (lineType) {
			case "line_1":
				setLineWeight(2);
				break;
			case "line_2":
				setLineWeight(5);
				break;
			case "line_3":
				setLineWeight(10);
				break;
			default:
				break;
		}
	};
	return (
		<div className="line_container">
			<div className="line_types">
				<Button
					className="line"
					htmlType="submit"
					type="text"
					id="line_1"
					icon={<LightLineIcon />}
					onClick={changeLineWidth}
				/>
				<Button
					className="line"
					htmlType="submit"
					type="text"
					id="line_2"
					icon={<MediumLineIcon />}
					onClick={changeLineWidth}
				/>
				<Button
					className="line"
					htmlType="submit"
					type="text"
					id="line_3"
					icon={<BoldLineIcon />}
					onClick={changeLineWidth}
				/>
			</div>
		</div>
	);
};

export default LineWeight;
