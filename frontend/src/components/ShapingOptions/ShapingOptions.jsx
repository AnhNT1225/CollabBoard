import React, { useContext, useEffect, useRef } from "react";
import { Button } from "antd";
import {
  RectangleIcon,
  RoundIcon,
  TriangleIcon,
  SquareIcon,
  StarIcon,
  RhombusIcon,
  HexagonIcon,
  PentagonIcon,
  LineIcon,
  EllipseIcon,
  ArrowLineIcon,
  // MarkIcon,
} from "../Icons/index";
import { ElementContext } from "../../context/elementContext";
import nextId from "react-id-generator";
import "./styles.scss";
const ShapingOptions = (props) => {
  const { socket, boardCode } = props;
  const { elementState, elementDispatch } = useContext(ElementContext);
  const handleShapeTypes = (e) => {
    const shapeName = e.currentTarget.name;
    switch (shapeName) {
      case "rectangle":
        let rectData = {
          x: 200,
          y: 200,
          width: 200,
          height: 100,
          stroke: "black",
          name: "rect",
          id: nextId("rect-"),
          type: "rect",
        };
        elementDispatch({ type: "CREATE_RECTANGLE", payload: rectData });

        break;
      case "square":
        let squareData = {
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          stroke: "black",
          id: nextId("square-"),
          type: "rect",
        };
        elementDispatch({ type: "CREATE_SQUARE", payload: squareData });

        break;
      case "round":
        let roundData = {
          x: 250,
          y: 250,
          radiusX: 100,
          radiusY: 100,
          stroke: "black",
          strokeWidth: 2,
          id: nextId("round-"),
          type: "ellipse",
        };
        elementDispatch({ type: "CREATE_ROUND", payload: roundData });

        break;
      case "ellipse":
        let ellipseData = {
          x: 250,
          y: 250,
          radiusX: 100,
          radiusY: 50,
          stroke: "black",
          strokeWidth: 2,
          id: nextId("ellipse-"),
          type: "ellipse",
        };
        elementDispatch({ type: "CREATE_ELLIPSE", payload: ellipseData });

        break;
      case "triangle":
        let triangleData = {
          x: 250,
          y: 250,
          sides: 3,
          radius: 100,
          stroke: "black",
          strokeWidth: 1,
          id: nextId("triangle-"),
          type: "polygons",
        };
        elementDispatch({ type: "CREATE_TRIANGLE", payload: triangleData });

        break;
      case "rhombus":
        let rhombusData = {
          x: 250,
          y: 250,
          sides: 4,
          radius: 100,
          stroke: "black",
          strokeWidth: 1,
          id: nextId("rhombus-"),
          type: "polygons",
        };
        elementDispatch({ type: "CREATE_RHOMBUS", payload: rhombusData });

        break;
      case "pentagon":
        let pentagonData = {
          x: 250,
          y: 250,
          sides: 5,
          radius: 100,
          stroke: "black",
          strokeWidth: 1,
          id: nextId("pentagon-"),
          type: "polygons",
        };
        elementDispatch({ type: "CREATE_PENTAGON", payload: pentagonData });

        break;
      case "hexagon":
        let hexagonData = {
          x: 250,
          y: 250,
          sides: 6,
          radius: 100,
          stroke: "black",
          strokeWidth: 1,
          id: nextId("hexagon-"),
          type: "polygons",
        };
        elementDispatch({ type: "CREATE_HEXAGON", payload: hexagonData });

        break;
      case "star":
        let starData = {
          x: 200,
          y: 200,
          numPoints: 5,
          innerRadius: 40,
          outerRadius: 70,
          stroke: "black",
          strokeWidth: 4,
          id: nextId("star-"),
          type: "star",
        };
        elementDispatch({ type: "CREATE_STAR", payload: starData });

        break;
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
      // 	elementDispatch({ type: "CREATE_LINE", payload: lineData });
      // 	break;
      // case "arrow":
      // 	let arrowType = "ArrowDrawable";
      // 	elementDispatch({ type: "CREATE_ARROW", payload: arrowType });
      // 	break;

      default:
        break;
    }
  };
  // const drawingShape = (elementState) => {
  // 	socket.emit("drawShape", {
  // 		code: boardCode,
  // 		shapes: {
  // 		  rects: elementState.rectangles,
  // 		  elips: elementState.ellipses,
  // 		  polys: elementState.polygons,
  // 		  stars: elementState.stars,
  // 		},
  // 	  });
  // }

  
  // useEffect(() => {
  //   // drawingShape(elementState)
	// 	socket?.emit("drawRect", {
	// 		code: boardCode,
	// 		rects: elementState?.rectangles,
	// 	  });
  // }, [elementState.rectangles, boardCode, socket]);

//   useEffect(() => {
//     // drawingShape(elementState)
//     socket?.emit("drawPoly", {
//       code: boardCode,
//       polys: elementState.rectangles,
//     });
//   }, [elementState.polygons]);
  // console.log('element thoi diem nay: ', elementState?.rectangles)
  // console.log('element polygons: ', elementState?.polygons)

  return (
    <div className="shape_container">
      <div className="shape_types">
        <Button
          className="shape_btn"
          id="rectangle"
          name="rectangle"
          onClick={handleShapeTypes}
          icon={<RectangleIcon className="svg_icon" />}
        />

        <Button
          className="shape_btn"
          id="round"
          name="round"
          icon={<RoundIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="triangle"
          name="triangle"
          icon={<TriangleIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />

        <Button
          className="shape_btn"
          id="square"
          name="square"
          icon={<SquareIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="rhombus"
          name="rhombus"
          icon={<RhombusIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="pentagon"
          name="pentagon"
          icon={<PentagonIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="hexagon"
          name="hexagon"
          icon={<HexagonIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="star"
          name="star"
          icon={<StarIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        {/* <Button
					className="shape_btn"
					id="flash"
					name="flash"
					icon={<FlashIcon className="svg_icon" />}
					onClick={handleShapeTypes}
				/> */}
        <Button
          className="shape_btn"
          id="ellipse"
          name="ellipse"
          icon={<EllipseIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="line"
          name="line"
          icon={<LineIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
        <Button
          className="shape_btn"
          id="arrow"
          name="arrow"
          icon={<ArrowLineIcon className="svg_icon" />}
          onClick={handleShapeTypes}
        />
      </div>
    </div>
  );
};

export default ShapingOptions;
