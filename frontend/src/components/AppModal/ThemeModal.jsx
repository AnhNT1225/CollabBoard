import React, { useRef, useContext } from "react";
import { Modal, Input, Button, message, Row, Col } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import Logo from "../Logo";
import { BoardContext } from "../../context/boardContext";
import BoardService from "../../services/boardService";
import Patern1 from "../../assets/media/dark_bacground.png";
import Patern2 from "../../assets/media/double-bubble-outline.png";
import Patern3 from "../../assets/media/moroccan-flower.png";
import Patern4 from "../../assets/media/repeated-square.png";
import Patern5 from "../../assets/media/watercolor.png";
import Patern6 from "../../assets/media/y-so-serious-white.png";
import YellowTheme from '../../assets/media/background_yellow.png';
import GreenTheme from '../../assets/media/background_green.png';
import AquaTheme from '../../assets/media/background_aqua.png';
import VioletTheme from '../../assets/media/background_violet.png';
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
      image: VioletTheme,
      value: "#e09af9",
    },
    {
      image: YellowTheme,
      value: '#f9dd99'
    },
    {
      image: GreenTheme,
      value: '#d3f99a'
    },
    {
      image: AquaTheme,
      value: '#9af3f9'
    },
  ];

  const createThemeBoard = async(value) => {
    console.log('e: ', value)
    await BoardService.createThemeBoard(value)
    .then((response) => {
      console.log("newBoard: ", response.board);
      history.push({
        pathname: `/board/${response.board._id}`,
        state: value,
      });
    })
    .catch((error) => {
      console.log("error: ", error);
    });
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
                    onClick={() =>createThemeBoard(t.value)}
                  >
                    <img
                      className="theme_item"
                      // width={190}
                      // height={190}
                      src={t.image}
                      alt="blank_canvas_media"
                    />
                  </button>
                </Col>
              ))}
            </Row>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button type="primary" htmlType='submit'>Select</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ThemeModal;
