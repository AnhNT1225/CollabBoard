import React, { useState, useEffect } from "react";
import { Input, Button, Select, Divider } from "antd";
import {
  FontSizeOutlined,
  UnderlineOutlined,
  BoldOutlined,
  ItalicOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
} from "@ant-design/icons";
import "./styles.scss";
function TextOptions(props) {
  const { Option } = Select;
  const { setTextProperty, isEditText, setIsEditText } = props;
  const [fonts, setFonts] = useState([]);

  const getFont = () =>
    fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDmsHMz7ufFxXwkgn8HDmUpWcpPEZpgwBI`
    )
      .then((response) => response.json())

      .catch((error) => {
        alert(error);
      });

  useEffect(() => {
    getFont()
      .then((response) => {
        setFonts(response.items);
      })
      .catch((error) => console.log(error));
  }, []);
  // console.log("font: ", fonts);
  // const changeFont = (e) => {
  // 	console.log("e", e);
  // 	const url = e;
  // 	const regex = /http/gi;
  // 	const sUrl = url.replace(regex, "https");
  // 	setTextProperty((prevState) => {
  // 		return {
  // 			...prevState,
  // 			fontName: sUrl,
  // 		};
  // 	});
  // };

  const changeFont = (e) => {
    console.log("e", e);
    const fontFamilyName = e;
    setTextProperty((prevState) => {
      return {
        ...prevState,
        fontFamily: fontFamilyName,
      };
    });
  };
  const changeStyle = (e) => {
    const id = e.currentTarget.id;
    switch (id) {
      case "bold":
        setTextProperty((prevState) => ({
          ...prevState,
          style: id,
        }));
        break;
      case "italic":
        setTextProperty((prevState) => ({
          ...prevState,
          style: id,
        }));
        break;
      case "underline":
        setTextProperty((prevState) => ({
          ...prevState,
          style: id,
        }));
        break;
      default:
        setTextProperty((prevState) => ({
          ...prevState,
          style: "normal",
        }));
        break;
    }
  };

  const changeAlign = (e) => {
    const id = e.currentTarget.id;
    switch (id) {
      case "text_align_left":
        setTextProperty((prevState) => ({
          ...prevState,
          align: "left",
        }));
        break;
      case "text_align_center":
        setTextProperty((prevState) => ({
          ...prevState,
          align: "center",
        }));
        break;
      case "text_align_right":
        setTextProperty((prevState) => ({
          ...prevState,
          align: "right",
        }));
        break;
      default:
        setTextProperty((prevState) => ({
          ...prevState,
          align: "left",
        }));
        break;
    }
  };

  const handleDoneText = (e) => {
    setIsEditText(false);
    setTextProperty({
      color: "black",
      size: 20,
    });
  };
  return (
    <div>
      <div
        className="comment-filter"
        // onSubmit={createTextProperty}
      >
        <div className="text_font">
          <Select
            id="fontName"
            name="fontName"
            style={{ width: 100 }}
            placeholder="Select Font"
            onChange={changeFont}
            // bordered={false}
          >
            {fonts.map((item, index) => (
              <Option
                key={index}
                url={item.files.regular}
                title={item.family}
                // value={item.files.regular}
                value={item.family}
              >
                {item.family}
              </Option>
            ))}
          </Select>
        </div>
        <div className="text_color_picker">
          <Input
            bordered={false}
            type="color"
            title="Color"
            onChange={(e) =>
              setTextProperty((prevState) => ({
                ...prevState,
                color: e.target.value,
              }))
            }
            id="txt_color"
            name="txt_color"
            required
          />
        </div>
        <div className="text-size">
          <Input
            prefix={<FontSizeOutlined />}
            // bordered={false}
            name="txt_size"
            type="number"
            placeholder="Size"
            defaultValue={20}
            style={{ width: 80 }}
            title="Text Size"
            onChange={(e) =>
              setTextProperty((prevState) => ({
                ...prevState,
                size: parseInt(e.target.value),
              }))
            }
            required
          />
        </div>
        <div className="text-weight">
          <Button
            icon={<BoldOutlined style={{ fontSize: 16 }} />}
            type="text"
            htmlType="submit"
            id="bold"
            onClick={changeStyle}
          />
          <Button
            icon={<ItalicOutlined style={{ fontSize: 16 }} />}
            type="text"
            htmlType="submit"
            id="italic"
            onClick={changeStyle}
          />
          <Button
            icon={<UnderlineOutlined style={{ fontSize: 16 }} />}
            type="text"
            htmlType="submit"
            id="underline"
            onClick={changeStyle}
          />
        </div>
        <Divider type="vertical" style={{ fontSize: 40 }} />
        <div className="text_align">
          <Button
            htmlType="submit"
            type="text"
            icon={<AlignLeftOutlined style={{ fontSize: 20 }} />}
            id="text_align_left"
            onClick={changeAlign}
          />
          <Button
            htmlType="submit"
            type="text"
            icon={<AlignCenterOutlined style={{ fontSize: 20 }} />}
            id="text_align_center"
            onClick={changeAlign}
          />
          <Button
            htmlType="submit"
            type="text"
            icon={<AlignRightOutlined style={{ fontSize: 20 }} />}
            id="text_align_right"
            onClick={changeAlign}
          />
        </div>
        <Divider type="vertical" style={{ fontSize: 40 }} />
        {isEditText ? (
          <div className="done_btn">
            <button
              className="btn btn-primary"
              style={{ fontSize: 12 }}
              onClick={handleDoneText}
            >
              Done
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TextOptions;
