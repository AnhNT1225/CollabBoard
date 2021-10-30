import React, { useRef, useState, useEffect } from "react";
import { Image } from "react-konva";
// import useImage from "use-image";
const Img = ({ imageProps, onSelect, onChange }) => {
  const imageRef = useRef();
  const [image, setImage] = useState(null);
  // const trRef = React.useRef();
  // const [image] = useImage(imageProps.src);
  function handleLoad() {
    setImage(imageRef.current);
  }

  function loadImage() {
    const img = new window.Image();
    img.src = imageProps.src;
    img.crossOrigin = "Anonymous";
    imageRef.current = img;
    imageRef.current.addEventListener("load", handleLoad);
  }

  useEffect(() => {
    loadImage();
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleLoad);
      }
    };
  }, []);

  useEffect(() => {
    loadImage();
  }, [imageProps.src]);
  // useEffect(() => {
  // 	if (isSelected) {
  // 		// we need to attach transformer manually
  // 		trRef.current.setNode(imageRef.current);
  // 		trRef.current.getLayer().batchDraw();
  // 	}
  // }, [isSelected]);

  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        ref={imageRef}
        {...imageProps}
        image={image}
        name="shapes"
        draggable
        onDragEnd={(e) => {
          onChange({
            ...imageProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        // onTransformEnd={(e) => {
        //   const node = imageRef.current;
        //   const scaleX = node.scaleX();
        //   const scaleY = node.scaleY();
        //   onChange({
        //     ...imageProps,
        //     x: node.x(),
        //     y: node.y(),
        //     width: node.width() * scaleX,
        //     height: node.height() * scaleY,
        //   });
        // }}
      />
      {/* {isSelected && <Transformer ref={trRef} />} */}
    </React.Fragment>
  );
};
export default Img;
