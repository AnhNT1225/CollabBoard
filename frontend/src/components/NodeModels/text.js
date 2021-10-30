import React from "react";
import { Text} from "react-konva";
import FontFaceObserver from "fontfaceobserver";
const Typer = ({
	textProps,
	textStyle,
	isSelected,
	onSelect,
	onChange,
}) => {
	const textRef = React.useRef();

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
			<Text
				onClick={onSelect}
				onTap={onSelect}
				ref={textRef}
				{...textProps}
				name="shapes"
				draggable
				onDragEnd={(e) => {
					onChange({
						...textProps,
						x: e.target.x(),
						y: e.target.y(),
					});
				}}
				onTransform={(e) => {
					const textNode = textRef.current;
					textNode.setAttrs({
						width: textNode.width() * textNode.scaleX(),
						scaleX: 1,
					});
				}}
				onDblClick={(e) => {
					// hide text node and transformer:
					console.log("textRef: ", textRef.current);
					textRef.current.hide();
					// trRef.current.hide();

					let textPosition = textRef.current.absolutePosition();
					console.log("textPosition: ", textPosition);
					// then lets find position of stage container on the page:
					let stageBox = e.target
						.getStage()
						.container()
						.getBoundingClientRect();
					// so position of textarea will be the sum of positions above:
					let areaPosition = {
						x: stageBox.left + textPosition.x,
						y: stageBox.top + textPosition.y,
					};

					let observers = [];
					let font = new FontFaceObserver(textStyle.fontFamily);
					observers.push(font.load(null, 5000));
					Promise.all(observers)
						.then(function (fonts) {
							fonts.forEach(function (font) {
								console.log(font + "loaded");
								// Map the result of the Promise back to our existing data,
								// to get the other properties we need.
								// console.log(exampleFontData[font.family].color);
							});
						})
						.catch(function (err) {
							console.warn("Some critical font are not available:", err);
						});

					let textarea = document.createElement("textarea");
					document.body.appendChild(textarea);
					// apply many styles to match text on canvas as close as possible
					// remember that text rendering on canvas and on the textarea can be different
					// and sometimes it is hard to make it 100% the same. But we will try...
					console.log("text style: ", textStyle);
					textarea.value = textRef.current.text();
					// textarea.select();
					textarea.placeholder = "Type here";
					textarea.style.position = "absolute";
					textarea.style.top = areaPosition.y + "px";
					textarea.style.left = areaPosition.x + "px";
					textarea.style.width =
						textRef.current.width() - textRef.current.padding() * 2 + "px";
					textarea.style.height =
						textRef.current.height() - textRef.current.padding() * 2 + 5 + "px";
					textarea.style.fontSize =
						textRef.current.fontSize(textStyle.size) + "px";
					textarea.style.border = "none";
					textarea.style.padding = "0px";
					textarea.style.margin = "0px";
					textarea.style.overflow = "hidden";
					textarea.style.background = "none";
					textarea.style.outline = "none";
					textarea.style.resize = "none";
					if (textStyle.style === "underline") {
						textarea.style.textDecoration = textRef.current.textDecoration(
							textStyle.style
						);
					} else {
						textarea.style.fontStyle = textRef.current.fontStyle(
							textStyle.style
						);
					}
					textarea.style.lineHeight = textRef.current.lineHeight(1);
					textarea.style.fontFamily = textRef.current.fontFamily(
						textStyle.fontFamily
					);
					textarea.style.transformOrigin = "left top";
					textarea.style.textAlign = textRef.current.align(textStyle.align);
					textarea.style.color = textRef.current.fill(textStyle.color);
					let rotation = textRef.current.rotation();
					let transform = "";
					if (rotation) {
						transform += "rotateZ(" + rotation + "deg)";
					}
					let px = 0;
					let isFirefox =
						navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
					if (isFirefox) {
						px += 2 + Math.round(textRef.current.fontSize() / 20);
					}
					transform += "translateY(-" + px + "px)";
					textarea.style.transform = transform;
					textarea.style.height = "auto";
					// after browsers resized it we can set actual value
					textarea.style.height = textarea.scrollHeight + 3 + "px";
					textarea.focus();
					function removeTextarea() {
						textarea.parentNode.removeChild(textarea);
						window.removeEventListener("click", handleOutsideClick);
						textRef.current.show();
						// boardDispatch({
						// 	type: "ADD_NEW_DRAWING",
						// 	payload: textRef.current.attrs,
						// });
						onChange({
							...textProps,
							text: textRef.current.text(),
							width: textRef.current.width(),
							fontSize: textRef.current.fontSize(),
							textDecoration: textRef.current.textDecoration(),
							fill: textRef.current.fill(),
						});
						console.log("textRef: ", textRef.current.attrs);
						// trRef.current.show();
						// trRef.current.forceUpdate();
					}
					function setTextareaWidth(newWidth) {
						if (!newWidth) {
							// set width for placeholder
							newWidth =
								textRef.current.placeholder.length * textRef.current.fontSize();
						}
						// some extra fixes on different browsers
						let isSafari = /^((?!chrome|android).)*safari/i.test(
							navigator.userAgent
						);
						let isFirefox =
							navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
						if (isSafari || isFirefox) {
							newWidth = Math.ceil(newWidth);
						}
						let isEdge =
							document.documentMode || /Edge/.test(navigator.userAgent);
						if (isEdge) {
							newWidth += 1;
						}
						textarea.style.width = newWidth + "px";
					}

					textarea.addEventListener("keydown", function (e) {
						// setIsEditText(true);
						// hide on enter
						// but don't hide on shift + enter
						// let key = e.key || e.keyCode;
						if (e.keyCode === 13 && !e.shiftKey) {
							textRef.current.text(textarea.value);
							removeTextarea();
						}
						// on esc do not set value back to node
						if (e.keyCode === 27) {
							removeTextarea();
						}
					});
					textarea.addEventListener("keydown", function (e) {
						// setIsEditText(true);
						let scale = textRef.current.getAbsoluteScale().x;
						setTextareaWidth(textRef.current.width() * scale);
						textarea.style.height = "auto";
						textarea.style.height =
							textarea.scrollHeight + textRef.current.fontSize() + "px";
					});

					function handleOutsideClick(e) {
						if (e.target !== textarea) {
							removeTextarea();
							// setIsEditText(false);
						}
					}
					setTimeout(() => {
						window.addEventListener("click", handleOutsideClick);
					});
				}}
			/>
			{/* {isSelected && (
				<Transformer
					ref={trRef}
					boundBoxFunc={(oldBox, newBox) => {
						// // set minimum width of text
						newBox.width = Math.max(30, newBox.width);
						return newBox;
					}}
					enabledAnchors={["middle-left", "middle-right"]}
				/>
			)} */}
		</React.Fragment>
	);
};

export default Typer;
