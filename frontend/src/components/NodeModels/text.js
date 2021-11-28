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

	return (
		<React.Fragment>
			<Text
				onClick={onSelect}
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
					// find position of stage container on the page:
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
							});
						})
						.catch(function (err) {
							console.warn("Some critical font are not available:", err);
						});

					let textarea = document.createElement("textarea");
					document.body.appendChild(textarea);
					// apply many styles to match text on canvas as close as possible
					textarea.value = textRef.current.text();
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
						onChange({
							...textProps,
							text: textRef.current.text(),
							width: textRef.current.width(),
							fontSize: textRef.current.fontSize(),
							textDecoration: textRef.current.textDecoration(),
							fill: textRef.current.fill(),
						});
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
						let scale = textRef.current.getAbsoluteScale().x;
						setTextareaWidth(textRef.current.width() * scale);
						textarea.style.height = "auto";
						textarea.style.height =
							textarea.scrollHeight + textRef.current.fontSize() + "px";
						// using shift + enter to down the line
						if (e.keyCode === 13 && !e.shiftKey) {
							textRef.current.text(textarea.value);
							removeTextarea();
						}
						// on esc do not set value back to node
						if (e.keyCode === 27) {
							removeTextarea();
						}
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
		</React.Fragment>
	);
};

export default Typer;
