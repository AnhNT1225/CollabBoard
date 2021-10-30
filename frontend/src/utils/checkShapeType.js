import nextId from "react-id-generator";
export const checkShapeType = (type, position) => {
	let shapeData;
	switch (type) {
		case "rectangle":
			// setShapingProperty(shapeName);
			shapeData = {
				x: position.x,
				y: position.y,
				width: 200,
				height: 100,
				stroke: "black",
				name: "rect",
				id: nextId("rect-"),
			};
			return shapeData;
		case "square":
			// setShapingProperty(shapeName);
			shapeData = {
				x: 50,
				y: 50,
				width: 100,
				height: 100,
				fill: "red",
				name: "rect",
				id: nextId("square-"),
			};
			return shapeData;
		case "round":
			// setShapingProperty(shapeName);
			shapeData = {
				x: 250,
				y: 250,
				radiusX: 100,
				radiusY: 100,
				stroke: "black",
				strokeWidth: 2,
				id: nextId("round-"),
			};
			return shapeData;
		case "ellipse":
			// setShapingProperty(shapeName);
			shapeData = {
				x: 250,
				y: 250,
				radiusX: 100,
				radiusY: 50,
				fill: "yellow",
				stroke: "black",
				strokeWidth: 2,
				id: nextId("ellipse-"),
			};
			return shapeData;
		case "triangle":
			// setShapingProperty(shapeName);
			shapeData = {
				x: 250,
				y: 250,
				sides: 3,
				radius: 100,
				stroke: "black",
				strokeWidth: 1,
				id: nextId("triangle-"),
			};
			return shapeData;
		case "rhombus":
			shapeData = {
				x: 250,
				y: 250,
				sides: 4,
				radius: 100,
				stroke: "black",
				strokeWidth: 1,
				id: nextId("rhombus-"),
			};
			return shapeData;
		case "pentagon":
			shapeData = {
				x: 250,
				y: 250,
				sides: 5,
				radius: 100,
				stroke: "black",
				strokeWidth: 1,
				id: nextId("hexagon-"),
			};
			return shapeData;
		case "hexagon":
			shapeData = {
				x: 250,
				y: 250,
				sides: 6,
				radius: 100,
				stroke: "black",
				strokeWidth: 1,
				id: nextId("hexagon-"),
			};
			return shapeData;
		case "star":
			shapeData = {
				x: 200,
				y: 200,
				numPoints: 5,
				innerRadius: 40,
				outerRadius: 70,
				fill: "yellow",
				stroke: "black",
				strokeWidth: 4,
				id: nextId("star-"),
			};
			return shapeData;
		// case "line":
		// 	let lineData = {
		// 		x: 200,
		// 		y: 200,
		// 		points: [10, 70, 40, 23, 150, 60, 250, 20],
		// 		strokeWidth: 10,
		// 		lineCap: "round",
		// 		lineJoin: "round",
		// 		stroke: "black",
		// 		id: nextId("line-"),
		// 	};
		// 	shapeDispatch({ type: "CREATE_LINE", payload: lineData });
		// 	break;
		// case "arrow":
		// 	let arrowType = "ArrowDrawable";
		// 	shapeDispatch({ type: "CREATE_ARROW", payload: arrowType });
		// 	break;

		default:
			return shapeData;
	}
};
