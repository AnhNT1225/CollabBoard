import React, { useRef, useContext } from "react";
import { Modal, Input, Button, message, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Logo from "../Logo";
import { BoardContext } from "../../context/boardContext";
import BoardService from "../../services/boardService";
import Patern1 from "../../assets/images/double-bubble-dark.png";
import Patern2 from "../../assets/images/double-bubble-outline.png";
import Patern3 from "../../assets/images/moroccan-flower.png";
import Patern4 from "../../assets/images/repeated-square.png";
import Patern5 from "../../assets/images/watercolor.png";
import Patern6 from "../../assets/images/y-so-serious-white.png";
import { useHistory } from "react-router-dom";

const ThemeModal = (props) => {
  const { themeModal, setThemeModal, setCreateBoardModal, socket } = props;
  const { boardState, boardDispatch } = useContext(BoardContext);

  const history = useHistory();
  const backToPrevious = () => {
    setThemeModal(false);
    setCreateBoardModal(true);
  };

  const themes = [
    {
      base64Src: Patern1,
      title: "Overview",
    },
  ];

  const createThemeBoard = (value) => {
    // console.log('e: ', value)
  }
  return (
    <Modal
      visible={themeModal}
      width={1000}
      bodyStyle={{ padding: "2rem", height: 300 }}
      footer={null}
      onOk={() => setThemeModal(false)}
      onCancel={() => setThemeModal(false)}
      title={<ArrowLeftOutlined onClick={backToPrevious} />}
    >
      <div>
        <div className="theme_container">
          <div className="selection_sidebar">
            <h4>Theme</h4>
          </div>
          <div className="selection_themes">
            <Row gutter={[8, 16]}>
              {themes.map((t, index) => (
                <Col key={index} span={6}>
                  <button
                    className="theme_frame"
                    onClick={createThemeBoard(t.base64Src)}
                  >
                    <img
                      className="theme_item"
                      // width={190}
                      // height={190}
                      src={t.base64Src}
                      alt="blank_canvas_media"
                    />
                  </button>
                </Col>
              ))}
              {/* <Col span={6}>
                <button
                  className="theme_frame"
                  onClick={(e) => console.log("e: ", e.target.value)}
                >
                  <img
                    className="theme_item"
                    // width={190}
                    // height={190}
                    src={Patern1}
                    alt="blank_canvas_media"
                  />
                </button>
              </Col>
              <Col span={6}>
                <button className="theme_frame">
                  <img
                    className="theme_item"
                    // width={190}
                    // height={190}
                    src={Patern2}
                    alt="blank_canvas_media"
                  />
                </button>
              </Col>
              <Col span={6}>
                <button className="theme_frame">
                  <img
                    className="theme_item"
                    // width={190}
                    // height={190}
                    src={Patern3}
                    alt="blank_canvas_media"
                  />
                </button>
              </Col>
              <Col span={6}>
                {" "}
                <button className="theme_frame">
                  <img
                    className="theme_item"
                    // width={190}
                    // height={190}
                    src={Patern4}
                    alt="blank_canvas_media"
                  />
                </button>
              </Col> */}
            </Row>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary">Select</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ThemeModal;
