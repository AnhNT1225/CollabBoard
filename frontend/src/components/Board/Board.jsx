import React, { useState, useRef, useEffect, useContext, memo } from "react";
import ControlMenu from "../ControlMenu";
import Conversation from "../Conversation/Conversation";
import { withRouter } from "react-router-dom";
import { message } from "antd";
import OverlayMenu from "../OverlayMenu/OverlayMenu";
import { Stage, Layer, Line, Rect, Transformer } from "react-konva";
import "./Board.scss";
import Rectangle from "../NodeModels/rectangle";
import Polygon from "../NodeModels/polygon";
import Oval from "../NodeModels/ellipse";
import StarShape from "../NodeModels/star";
import Img from "../NodeModels/image";
import Typer from "../NodeModels/text";
import { ElementContext } from "../../context/elementContext";
import BoardService from "../../services/boardService";
import nextId from "react-id-generator";
import Note from "../NodeModels/label";

const Board = (props) => {
  const {
    menuComponent,
    drawingProperty,
    setDrawingProperty,
    textProperty,
    setMenuComponent,
    // location,
    boardId,
    user,
    isEditText,
    setIsEditText,
    boardState,
    boardDispatch,
    socket,
  } = props;
  console.log("user from YTF: ", user);
  //----------------USE FOR SET SHAPING COMBINATION -------------------
  const { elementState, elementDispatch } = useContext(ElementContext);
  // const { boardState, boardDispatch } = useContext(BoardContext);

  // useEffect(() => {
  //   boardDispatch({ type: "FETCH_BOARDS_REQUEST" });
  //   BoardService.getBoard(boardId)
  //     .then(async(response) => {
  //       console.log("response at board: ", response.data);
  //       // response.id = boardId;
  //       // setCurrentBoard(response);
  //       await boardDispatch({
  //         type: "FETCH_CURRENT_BOARD_SUCCESS",
  //         payload: response.data,
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("err: ", error);
  //     });
  //   return () => {
  //     boardDispatch({ type: "FETCH_DATA_FAILURE" });
  //   };
  // }, []);
  //----------------------------------
  const stageRef = useRef();
  const layerRef = useRef();

  //check the text element is edit or not

  const isDrawing = useRef(false);

  const [selectedId, selectShape] = useState(null);

  // console.log("text property: ", textProperty);

  const [isChatOpen, setIsChatOpen] = useState(false);

  // console.log("state push by history: ", location.state);
  const dragUrl = useRef();
  const [nodesArray, setNodes] = useState([]);
  // console.log("nodeArray: ", nodesArray);
  const trRef = useRef();
  //Accessing to Konva through window object
  const Konva = window.Konva;
  const selectionRectRef = useRef();
  const oldPos = React.useRef(null);
  const selection = React.useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
  });

  // our history
  // let appHistory = [elementState.appState]; //before params is files
  // let appHistoryStep = 0;

  const updateSelectionRect = () => {
    const node = selectionRectRef.current;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: "rgba(0, 161, 255, 0.3)",
    });
    // layerRef.current.batchDraw();
    node.getLayer().batchDraw();
  };

  useEffect(() => {
    if (
      boardState.currentBoard &&
      boardState.currentBoard.storage &&
      boardState.currentBoard.media
    ) {
      console.log("test boardState: ", boardState.currentBoard);
      console.log("test contributors: ", boardState.currentBoard.media);
      const files = [...boardState.currentBoard.media];
      files.forEach((el) => {
        let base64ImageString = Buffer.from(el.src, "binary").toString(
          "base64"
        );
        el.src = "data:image/png;base64," + base64ImageString;
      });

      elementDispatch({
        type: "SET_RECTANGLE",
        payload: boardState.currentBoard.storage.rectangles,
      });
      elementDispatch({
        type: "SET_ELLIPSE",
        payload: boardState.currentBoard.storage.ellipses,
      });
      elementDispatch({
        type: "SET_POLYGONS",
        payload: boardState.currentBoard.storage.polygons,
      });
      elementDispatch({
        type: "SET_STAR",
        payload: boardState.currentBoard.storage.stars,
      });
      elementDispatch({
        type: "SET_LINE",
        payload: boardState.currentBoard.storage.lines,
      });
      elementDispatch({
        type: "SET_NOTE",
        payload: boardState.currentBoard.storage.notes,
      });
      elementDispatch({
        type: "SET_TEXT",
        payload: boardState.currentBoard.storage.texts,
      });
      elementDispatch({ type: "SET_FILE", payload: files });
    }
  }, [boardState, elementDispatch]);
  // console.log("currentBoard: ", boardState?.currentBoard);
  console.log("elementState.lines : ", elementState.lines);
  console.log("files: ", elementState.files);

  useEffect(() => {
    console.log('element State: ', elementState?.rectangles)
  }, [elementState, socket]);

  //----------------------------SOCKET IO client connect to server---------------------------------
  useEffect(() => {
    // socket?.on("connect", function () {
    //   //  'connect' event is received on client on every connection start.
    //   socket?.emit("create-room", boardState.currentBoard?.code); //  where 'user' is your object containing email.
    // });
    socket?.emit("create-room", boardState.currentBoard?.code);
    const onNotification = (joinData) => {
      console.log("join data: ", joinData);
      message.success(joinData);
    };

    socket?.on("notification", onNotification);

    const onDrawingImage = async(fileData) => {
      // console.log("FILE DATA: ", fileData)
      // fileData.forEach((el) => {
      //   let base64ImageString = Buffer.from(el.src, "binary").toString(
      //     "base64"
      //   );
      //   el.src = "data:image/png;base64," + base64ImageString;
      // });
      // console.log("file data: ", fileData);
      await elementDispatch({ type: "SET_FILE", payload: fileData });
      // elementDispatch({ type: "CREATE_FILE", payload: fileData });
    };

    socket?.on("file", onDrawingImage);

    const onDrawingEvent = (lineData) => {
      console.log("DATA res: ", lineData);
      // setDrawingLines((prev) => [...prev, lineData]);
      elementDispatch({ type: "SET_LINE", payload: lineData });
    };
    socket?.on("line", onDrawingEvent);

    const onDrawingShapeEvent = (shapeData) => {
      console.log("Shape data response: ", shapeData);
      // elementDispatch({ type: "SET_LINE", payload: shapeData.lines });
      elementDispatch({ type: "SET_RECTANGLE", payload: shapeData?.rects });
      elementDispatch({ type: "SET_ELLIPSE", payload: shapeData?.elips });
      elementDispatch({ type: "SET_POLYGONS", payload: shapeData?.polys });
      elementDispatch({ type: "SET_STAR", payload: shapeData?.stars });
    };
    socket?.on("shape", onDrawingShapeEvent);

    const onDrawingTextEvent = (textData) => {
      console.log("text data response: ", textData);
      elementDispatch({ type: "SET_TEXT", payload: textData });
    };
    socket?.on("text", onDrawingTextEvent);

    const onDrawingNoteEvent = (noteData) => {
      console.log("note data response: ", noteData);
      elementDispatch({ type: "SET_NOTE", payload: noteData });
    };
    socket?.on("note", onDrawingNoteEvent);
    // // 	# the server is restarted, the client automatically reconnects and sends its buffered events
    // // connect
    // let count = 0;
    // setInterval(() => {
    // 	socket?.volatile.emit("ping", ++count);
    // }, 1000);

    // CLEAN UP THE EFFECT
    return () => {
      // socket.disconnect();
      socket?.off("line", onDrawingEvent);
      socket?.off("shape", onDrawingShapeEvent);
      socket?.off("text", onDrawingTextEvent);
      socket?.off("file", onDrawingImage);
      socket?.off("note", onDrawingNoteEvent);
      socket?.off("notification", onNotification);
    };
  }, [elementDispatch, socket, boardState]);

  const handleCursor = (e) => {
    const container = e.currentTarget.getStage().container();
    // console.log("test ref: ", stageRef.current.container().style.cursor);
    switch (menuComponent) {
      // case "pen":
      // 	// container.style.cursor = "url(icons/editor_icon/pen.png), auto";
      // 	container.style.cursor = "pointer";
      // 	break;
      // case "eraser":
      // 	container.style.cursor = "move";
      // 	break;
      case "drawing":
        stageRef.current.container().style.cursor =
          'url("/icons/editor_icon/pen.png"),auto;';
        break;
      case "useHand":
        container.style.cursor = "grab";
        break;
      case "typing":
        container.style.cursor = "text";
        break;
      default:
        container.style.cursor = "default";
        break;
    }
  };

  const handleMouseDown = async (e) => {
    const container = stageRef.current.container();
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      let menuNode = document.getElementById("menu");
      menuNode.style.display = "none";
    }
    //get mouse position
    // const pos = e.target.getStage().getPointerPosition();
    const pos = stageRef.current.getRelativePointerPosition();
    //check menucomponent with the similarity action in tools board
    switch (menuComponent) {
      case "usePointer":
        stageRef.current.draggable(false);
        const isElement = e.target.findAncestor(".elements-container");
        const isTransformer = e.target.findAncestor("Transformer");
        if (isElement || isTransformer) {
          return;
        }

        // const pos = e.target.getStage().getPointerPosition();
        selection.current.visible = true;
        selection.current.x1 = pos.x;
        selection.current.y1 = pos.y;
        selection.current.x2 = pos.x;
        selection.current.y2 = pos.y;
        updateSelectionRect();
        break;
      case "useHand":
        //set draggable for scrolling board by mouse when select "pointer" tool
        stageRef.current.draggable(true);
        container.style.cursor = "grabbing";
        break;
      case "drawing":
        //if choose "Pen" tool cannot draggable on board
        stageRef.current.draggable(false);
        isDrawing.current = true;

        elementDispatch({
          type: "CREATE_LINE",
          payload: {
            id: nextId("line-"),
            points: [pos.x, pos.y],
            drawingProperty,
            type: "line"
          },
        });

        break;
      case "typing":
        //if choose "Pen" tool cannot draggable on board
        console.log("isEditText: ", isEditText);
        if (isEditText) {
          socket.emit("drawText", {
            code: boardState.currentBoard.code,
            text: elementState.texts,
          });
          return;
        }
        //stop draggble stage when click on Typing component
        stageRef.current.draggable(false);

        const textAttr = {
          text: "Type here",
          width: 200,
          x: pos.x,
          y: pos.y,
          fontSize: 20,
          fill: "black",
          fontStyle: "normal",
          textDecoration: "empty",
          id: nextId("text-"),
          type: 'text'
        };
        elementDispatch({ type: "CREATE_TEXT", payload: textAttr });
        // setTexts((prev) => [...prev, textAttr]);
        setIsEditText(true);

        break;
      case "shaping":
        //if choose "Pen" tool cannot draggable on board
        stageRef.current.draggable(false);
        // deselect when clicked on empty area (click outside shape -> no selected shape)
        if (clickedOnEmpty) {
          selectShape(null);
        }
        //emit the shapeInfo to the socket server
        socket?.emit("drawShape", {
          code: boardState.currentBoard.code,
          shapes: {
            rects: elementState.rectangles,
            elips: elementState.ellipses,
            polys: elementState.polygons,
            stars: elementState.stars,
          },
        });
        break;
      case "noting":
        socket.emit('drawNote', {
          code: boardState.currentBoard?.code,
          notes: elementState.notes
        })
        break;
      case "media_upload":
        socket.emit("drawFile", {
          code: boardState.currentBoard?.code,
          files: elementState?.files,
        });
        break;
      default:
        break;
    }
    layerRef.current.batchDraw();
  };

  const handleMouseMove = async (e) => {
    //GET Relative position for zooming pan get current pos
    const pos = stageRef.current.getRelativePointerPosition();
    switch (menuComponent) {
      case "usePointer":
        if (!selection.current.visible) {
          return;
        }
        // const pos = e.target.getStage().getPointerPosition();
        selection.current.x2 = pos.x;
        selection.current.y2 = pos.y;
        updateSelectionRect();
        break;
      case "drawing":
        // no drawing - skipping
        if (!isDrawing.current) {
          return;
        }
        let lastLine = elementState.lines[elementState.lines.length - 1];
        // add point
        lastLine.points = lastLine.points.concat([pos.x, pos.y]);

        // replace last
        elementState.lines.splice(elementState.lines.length - 1, 1, lastLine);
        console.log(
          "concat last: ",
          elementState.lines.splice(
            elementState.lines.length - 1,
            1,
            lastLine
          )[0]
        );
        elementDispatch({
          type: "SET_LINE",
          payload: elementState.lines.concat(),
        });
        break;

      default:
        break;
    }
  };

  const handleMouseUp = (e) => {
    const container = e.currentTarget.getStage().container();

    switch (menuComponent) {
      case "drawing":
        isDrawing.current = false;
        socket?.emit("drawLine", {
          code: boardState.currentBoard.code,
          line: elementState.lines,
        });

        break;
      case "useHand":
        container.style.cursor = "grab";
        break;
      case "usePointer":
        oldPos.current = null;
        if (!selection.current.visible) {
          return;
        }
        const selBox = selectionRectRef.current.getClientRect();

        const elements = [];
        layerRef.current.find(".shapes").forEach((elementNode) => {
          const elBox = elementNode.getClientRect();
          if (Konva.Util.haveIntersection(selBox, elBox)) {
            elements.push(elementNode);
          }
        });
        trRef.current.nodes(elements);
        selection.current.visible = false;
        // disable click event
        Konva.listenClickTap = false;
        updateSelectionRect();
        break;
      default:
        break;
    }
  };

  console.log("appState: ", elementState.appState);

  //Zooming pan by relative position (by MOUSE Wheel)
  //define scale rate of the stage on zooming
  const SCALE = 1.2;
  const handleWheel = (e) => {
    //mouse on wheel for zooming/pan applied to "pointer" tool
    if (menuComponent === "useHand") {
      e.evt.preventDefault();
      let oldScale = e.target.getStage().scaleX();

      let pointer = e.target.getStage().getPointerPosition();

      let mousePointTo = {
        x: (pointer.x - e.target.getStage().x()) / oldScale,
        y: (pointer.y - e.target.getStage().y()) / oldScale,
      };

      let newScale = e.evt.deltaY > 0 ? oldScale * SCALE : oldScale / SCALE;

      e.target.getStage().scale({ x: newScale, y: newScale });

      let newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };
      e.target.getStage().position(newPos);
    }
  };

  const handleKeyDown = async (e) => {
    console.log("keyCode: ", e.keyCode);
    if (e.ctrlKey && e.keyCode === 83) {
      //prevent the default action of Save on browser
      e.preventDefault();
      const uri = stageRef.current.toDataURL();
      const boardCanvasData = {
        board_src: uri,
        board_storage: {
          rectangles: JSON.stringify(elementState.rectangles),
          polygons: JSON.stringify(elementState.polygons),
          ellipses: JSON.stringify(elementState.ellipses),
          stars: JSON.stringify(elementState.stars),
          texts: JSON.stringify(elementState.texts),
          notes: JSON.stringify(elementState.notes),
          lines: JSON.stringify(elementState.lines),
        },
        board_media: JSON.stringify(elementState.files),
      };

      // saveStateToHistory

      await BoardService.updateBoardCanvas(boardId, boardCanvasData)
        .then(async (response) => {
          console.log("Board updated info: ", response.data);
          await boardDispatch({
            type: "SET_CURRENT_BOARD",
            payload: response.data,
          });
          elementDispatch({ type: "RESET_STATE" });
        })
        .catch((error) => {
          console.log("err: ", error);
        });
    }
  };

  let currentElement;

  const handleContextMenu = (e) => {
    e.evt.preventDefault();
    let menuNode = document.getElementById("menu");
    menuNode.style.display = "none";
    if (e.target === stageRef.current) {
      return;
    }
    currentElement = e.target;

    menuNode.style.display = "initial";
    const containerRect = stageRef.current.container().getBoundingClientRect();
    menuNode.style.top =
      containerRect.top + stageRef.current.getPointerPosition().y + 4 + "px";
    menuNode.style.left =
      containerRect.left + stageRef.current.getPointerPosition().x + 4 + "px";
  };

  const deleteElement = (e) => {
    elementDispatch({
      type: "REMOVE_APP_STATE",
      payload: currentElement.attrs,
    });

    if (currentElement.attrs?.points !== null) {
      elementDispatch({ type: "REMOVE_LINE", payload: currentElement.attrs });
    }
    if (currentElement.attrs.id?.includes("rect")) {
      elementDispatch({
        type: "REMOVE_RECTANGLE",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("square")) {
      elementDispatch({
        type: "REMOVE_RECTANGLE",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("ellipse")) {
      elementDispatch({
        type: "REMOVE_ELLIPSE",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("round")) {
      elementDispatch({
        type: "REMOVE_ELLIPSE",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("triangle")) {
      elementDispatch({
        type: "REMOVE_POLYGONS",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("rhombus")) {
      elementDispatch({
        type: "REMOVE_POLYGONS",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("pentagon")) {
      elementDispatch({
        type: "REMOVE_POLYGONS",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("hexagon")) {
      elementDispatch({
        type: "REMOVE_POLYGONS",
        payload: currentElement.attrs,
      });
    }
    if (currentElement.attrs.id?.includes("star")) {
      elementDispatch({ type: "REMOVE_STAR", payload: currentElement.attrs });
    }

    // if(currentElement.attrs.id.includes('note')){
    //   elementDispatch({type: "REMOVE_NOTE", payload: currentElement.attrs})
    // }
    if (currentElement.attrs.id?.includes("text")) {
      elementDispatch({ type: "REMOVE_TEXT", payload: currentElement.attrs });
    }
    if (currentElement.attrs.id?.includes("file")) {
      elementDispatch({ type: "REMOVE_FILE", payload: currentElement.attrs });
    }
  };

  const copyElement = (e) => {
    console.log("copy: ", currentElement.clone());
    const copyElement = currentElement.clone().attrs;

    // if(currentElement.attrs.hasOwnProperty("lineCap")){
    //   copyElement.id = nextId("line-")
    //   elementDispatch({type: "CREATE_LINE", payload: copyElement})
    // }

    if (currentElement.attrs.id?.includes("rect")) {
      copyElement.id = nextId("rect-");
      elementDispatch({ type: "CREATE_RECTANGLE", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("square")) {
      copyElement.id = nextId("square-");
      elementDispatch({ type: "CREATE_SQUARE", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("ellipse")) {
      copyElement.id = nextId("ellipse-");
      elementDispatch({ type: "CREATE_ELLIPSE", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("round")) {
      copyElement.id = nextId("round-");
      elementDispatch({ type: "CREATE_ROUND", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("triangle")) {
      copyElement.id = nextId("triangle-");
      elementDispatch({ type: "CREATE_TRIANGLE", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("rhombus")) {
      copyElement.id = nextId("rhombus-");
      elementDispatch({ type: "CREATE_RHOMBUS", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("pentagon")) {
      copyElement.id = nextId("pentagon-");
      elementDispatch({ type: "CREATE_PENTAGON", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("hexagon")) {
      copyElement.id = nextId("hexagon-");
      elementDispatch({ type: "CREATE_HEXAGON", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("star")) {
      copyElement.id = nextId("star-");
      elementDispatch({ type: "CREATE_STAR", payload: copyElement });
    }
    // if(currentElement.attrs.id.includes('note')){
    //   copyElement.id = nextId("note-")
    //   elementDispatch({type: "CREATE_NOTE", payload: copyElement})
    // }
    if (currentElement.attrs.id?.includes("text")) {
      copyElement.id = nextId("text-");
      elementDispatch({ type: "CREATE_TEXT", payload: copyElement });
    }
    if (currentElement.attrs.id?.includes("file")) {
      copyElement.id = nextId("file-");
      elementDispatch({ type: "CREATE_FILE", payload: copyElement });
    }
  };
  return (
    <>
      <div className="canvas_wrap">
        <div id="container" tabIndex={1} onKeyDown={handleKeyDown}>
          <Stage
            id="canvas"
            container="container"
            width={window.innerWidth}
            height={window.innerHeight - 71}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onMouseEnter={handleCursor}
            onWheel={handleWheel}
            onContextMenu={handleContextMenu}
            draggable={false}
            ref={stageRef}
          >
            <Layer ref={layerRef}>
              {/* Line using for drawing */}
              {elementState?.lines.map((line, i) => {
                return (
                  <Line
                    key={i}
                    name="shapes"
                    points={line.points}
                    stroke={line.drawingProperty.brushColor}
                    strokeWidth={line.drawingProperty.brushStroke}
                    tension={0.5}
                    lineCap={line.drawingProperty.brushCap}
                    isSelected={line.id === selectedId}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(line.id);
                    }}
                  />
                );
              })}

              {elementState?.rectangles.map((rect, i) => {
                return (
                  <Rectangle
                    key={i}
                    shapeProps={rect}
                    isSelected={rect.id === selectedId}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(rect.id);
                    }}
                    onChange={(newAttrs) => {
                      // console.log("new attr: ", newAttrs);
                      elementDispatch({
                        type: "UPDATE_APP_STATE",
                        payload: newAttrs,
                      });
                      const rects = elementState.rectangles.slice();
                      // console.log("rects: ", rects);
                      rects[i] = newAttrs;
                      // remove from the list:
                      rects.splice(i, 1);
                      // add to the top
                      rects.push(newAttrs);
                      elementDispatch({
                        type: "SET_RECTANGLE",
                        payload: rects,
                      });
                    }}
                  />
                );
              })}
              {elementState?.polygons.map((child, i) => {
                return (
                  <Polygon
                    key={i}
                    shapeProps={child}
                    isSelected={child.id === selectedId}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(child.id);
                    }}
                    onChange={(newAttrs) => {
                      elementDispatch({
                        type: "UPDATE_APP_STATE",
                        payload: newAttrs,
                      });
                      const polys = elementState.polygons.slice();
                      polys[i] = newAttrs;
                      elementDispatch({ type: "SET_POLYGONS", payload: polys });
                      // setPolygons(polys);
                    }}
                  />
                );
              })}

              {elementState?.ellipses.map((oval, i) => {
                return (
                  <Oval
                    key={i}
                    shapeProps={oval}
                    isSelected={oval.id === selectedId}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(oval.id);
                    }}
                    onChange={(newAttrs) => {
                      //add new change attr for app state
                      elementDispatch({
                        type: "UPDATE_APP_STATE",
                        payload: newAttrs,
                      });
                      const ovals = elementState.ellipses.slice();
                      ovals[i] = newAttrs;
                      elementDispatch({ type: "SET_ELLIPSE", payload: ovals });
                      // setEllipses(ovals);
                    }}
                  />
                );
              })}

              {elementState?.stars.map((star, i) => {
                return (
                  <StarShape
                    key={i}
                    shapeProps={star}
                    isSelected={star.id === selectedId}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(star.id);
                    }}
                    onChange={(newAttrs) => {
                      elementDispatch({
                        type: "UPDATE_APP_STATE",
                        payload: newAttrs,
                      });
                      const starLists = elementState.stars.slice();
                      starLists[i] = newAttrs;
                      elementDispatch({
                        type: "SET_STAR",
                        payload: starLists,
                      });

                      // setStars(newStars);
                    }}
                  />
                );
              })}

              {elementState?.files.map((image, i) => {
                return (
                  <Img
                    key={i}
                    imageUrl={image.src}
                    imageProps={image}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(image.id);
                    }}
                    onChange={(newAttrs) => {
                      // elementDispatch({
                      //   type: "UPDATE_APP_STATE",
                      //   payload: newAttrs,
                      // });
                      const imgs = elementState.files.slice();
                      imgs[i] = newAttrs;
                      elementDispatch({ type: "SET_FILE", payload: imgs });
                      // setFiles(imgs);
                    }}
                  />
                );
              })}

              {elementState?.texts.map((text, i) => {
                return (
                  <Typer
                    key={i}
                    textProps={text}
                    textStyle={textProperty}
                    setIsEditText={setIsEditText}
                    setMenuComponent={setMenuComponent}
                    isSelected={text.id === selectedId}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(text.id);
                    }}
                    onChange={(newAttrs) => {
                      elementDispatch({
                        type: "UPDATE_APP_STATE",
                        payload: newAttrs,
                      });
                      const txts = elementState.texts.slice();
                      txts[i] = newAttrs;
                      elementDispatch({
                        type: "SET_TEXT",
                        payload: txts,
                      });
                      socket.emit("drawText", {
                        code: boardState.currentBoard.code,
                        text: txts,
                      });
                    }}
                  />
                );
              })}

              {elementState?.notes.map((note, i) => {
                return (
                  <Note
                    key={i}
                    noteProps={note}
                    onSelect={(e) => {
                      if (e.current !== undefined) {
                        let temp = nodesArray;
                        if (!nodesArray.includes(e.current))
                          temp.push(e.current);
                        setNodes(temp);
                        trRef.current.nodes(nodesArray);
                        trRef.current.getLayer().batchDraw();
                      }
                      selectShape(note.id);
                    }}
                    onChange={(newAttrs) => {
                      elementDispatch({
                        type: "UPDATE_APP_STATE",
                        payload: newAttrs,
                      });
                      const noteLists = elementState.notes.slice();
                      noteLists[i] = newAttrs;
                      elementDispatch({
                        type: "SET_NOTE",
                        payload: noteLists,
                      });
                    }}
                  />
                );
              })}
              <Transformer
                ref={trRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // limit resize
                  if (newBox.width < 5 || newBox.height < 5) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
              <Rect fill="rgba(0,0,255,0.5)" ref={selectionRectRef} />
            </Layer>
          </Stage>
          <OverlayMenu
            setMenuComponent={setMenuComponent}
            dragUrl={dragUrl}
            setDrawingProperty={setDrawingProperty}
            socket={socket}
          />
        </div>
        <div id="menu">
          <button id="pulse-button" onClick={copyElement}>
            Copy
          </button>
          <button id="delete-button " onClick={deleteElement}>
            Delete
          </button>
        </div>
        <ControlMenu
          appHistoryStep={elementState.appHistoryStep}
          appHistory={elementState.appState}
          setIsChatOpen={setIsChatOpen}
          elementDispatch={elementDispatch}
        />
        {isChatOpen ? (
          <Conversation
            user={user}
            setIsChatOpen={setIsChatOpen}
            boardId={boardId}
            socket={socket}
            boardCode={boardState.currentBoard.code}
          />
        ) : null}
        {/* <div className="chat_pan">
					<Button
						className="chat_btn"
						size="large"
						icon={<MessageOutlined style={{ fontSize: 25 }} />}
						onClick={() => setIsChatOpen(true)}
					/>
				</div> */}
      </div>
    </>
  );
};

export default memo(Board);
