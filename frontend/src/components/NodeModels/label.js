import React from "react";
import { Label, Tag, Text } from "react-konva";
const Note = ({
	noteProps,
	onSelect,
	onChange,
}) => {
	const labelRef = React.useRef();

	// const trRef = React.useRef();

	// React.useEffect(() => {
	// 	if (isSelected) {
	// 		// we need to attach transformer manually
	// 		trRef.current.nodes([textRef.current]);
	// 		trRef.current.getLayer().batchDraw();
	// 		setIsEditText(true);
	// 	}
	// }, [isSelected]);

	return (
		<React.Fragment>
			  {/* <Label x={note.label.x} y={note.label.y} opacity={note.label.opacity}>
                  <Tag fill={note.tag.color} />
                  <Text text={note.content.text} padding={note.content.padding}
                  fontFamily={note.content.font} fontSize={note.content.size} fill='black'/>
                </Label> */}
				
			<Label onClick={onSelect}
				onTap={onSelect}
				ref={labelRef}
				{...noteProps}
				name="shapes"
				draggable
				onDragEnd={(e) => {
					onChange({
						...noteProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}>
				<Tag fill={noteProps.tag.color} />
				<Text text={noteProps.content.text} padding={noteProps.content.padding}
                  fontFamily={noteProps.content.font} fontSize={noteProps.content.size} fill='black' />
			</Label>
		</React.Fragment>
	);
};

export default Note;
