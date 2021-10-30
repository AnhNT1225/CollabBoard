import React from "react";
import { RegularPolygon } from "react-konva";

const Triangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const polygonRef = React.useRef();
	// const trRef = React.useRef();

	// React.useEffect(() => {
	// 	if (isSelected) {
	// 		// we need to attach transformer manually
	// 		// console.log("the trRef ", trRef.current);
	// 		trRef.current.nodes([polygonRef.current]);
	// 		trRef.current.getLayer().batchDraw();
	// 	}
	// }, [isSelected]);

	return (
		<React.Fragment>
			<RegularPolygon
				onClick={onSelect}
				onTap={onSelect}
				ref={polygonRef}
				{...shapeProps}
				name="shapes"
				draggable
				onDragEnd={(e) => {
					onChange({
						...shapeProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransformEnd={(e) => {
					// transformer is changing scale of the node
					// and NOT its width or height
					// but in the store we have only width and height
					// to match the data better we will reset scale on transform end

					const node = polygonRef.current;
					const scaleX = node.scaleX();
					const scaleY = node.scaleY();
					console.log("scale X: ", scaleX, "scale Y: ", scaleY);
					console.log("node width: ", node.width());
					console.log("node height: ", node.height());
					console.log("node x: ", node.x(), "node y: ", node.y());
					// we will reset it back
					node.scaleX(1);
					node.scaleY(1);
					onChange({
						...shapeProps,
						x: node.x(),
						y: node.y(),
						// set minimal value
						width: Math.max(220, node.width() * scaleX),
						height: Math.max(200, node.height() * scaleY),
					});
				}}
			/>
			{/* {isSelected && (
				<Transformer
					ref={trRef}
					boundBoxFunc={(oldBox, newBox) => {
						console.log("old box: ", oldBox);
						console.log("new box: ", newBox);
						// limit resize
						if (newBox.width < 10 || newBox.height < 10) {
							return oldBox;
						}
						return newBox;
					}}
				/>
			)} */}
		</React.Fragment>
	);
};

export default Triangle;
