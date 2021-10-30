import React, {useRef} from "react";
import { Line} from "react-konva";

const StraightLine = ({ shapeProps, isSelected, onSelect, onChange }) => {
	const lineRef = useRef();
	// const trRef = React.useRef();

	// React.useEffect(() => {
	// 	if (isSelected) {
	// 		// we need to attach transformer manually
	// 		trRef.current.nodes([lineRef.current]);
	// 		trRef.current.getLayer().batchDraw();
	// 	}
	// }, [isSelected]);

	return (
		<React.Fragment>
			<Line
				onClick={onSelect}
				onTap={onSelect}
				ref={lineRef}
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
					const node = lineRef.current;
					const scaleX = node.scaleX();
					const scaleY = node.scaleY();

					// we will reset it back
					node.scaleX(1);
					node.scaleY(1);
					onChange({
						...shapeProps,
						x: node.x(),
						y: node.y(),
						// set minimal value
						width: Math.max(5, node.width() * scaleX),
						height: Math.max(node.height() * scaleY),
					});
				}}
			/>
			{/* {isSelected && (
				<Transformer
					ref={trRef}
					boundBoxFunc={(oldBox, newBox) => {
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

export default StraightLine;
