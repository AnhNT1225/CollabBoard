import React, { useState, useEffect, useContext } from "react";
import { Button, Drawer, Modal } from "antd";
import nextId from "react-id-generator";
import { ElementContext } from "../../context/elementContext";
import ColorPicker from "../ColorPicker/ColorPicker";
import {
  PointerIcon,
  EditIcon,
  TypingIcon,
  ShapeIcon,
  MediaIcon,
  NoteIcon,
  EraserIcon,
} from "../Icons";
import "./overlaymenu.scss";
import NotePaper from "../NotePaper/NotePaper";

const OverlayMenu = (props) => {
  const { setMenuComponent, dragUrl, setDrawingProperty, socket } = props;
  const [selectedFile, setSelectedFile] = useState([]);
  const [preview, setPreview] = useState();
  const [isUploadModal, setIsUploadModal] = useState(false);
  const [isNoteModal, setIsNoteModal] = useState(false);
  const [noteColor, setNoteColor] = useState(null);
  const [noteTxt, setNoteTxt] = useState(null);
  const { elementDispatch } = useContext(ElementContext);

  const noteColors = [
    { name: "aqua", type: "aqua" },           //blue note
    { name: "less_yellow", type: "rgb(241, 241, 44)" },  //yellow note
    { name: "less_green", type: "rgb(152, 253, 152)" },   //green note
    { name: "less_pink", type: "rgb(253, 230, 234)" },   //pink note
    { name: "less_orange", type: "rgb(255, 184, 51)" },    //orange note
    { name: "burlywood", type: "burlywood" },           //wood note
    // { name: "white", type: "white" },              //white note
  ];

  const showDrawingOptions = async (e) => {
    setMenuComponent("drawing");
  };

  const showTypingOptions = async (e) => {
    setMenuComponent("typing");
  };

  const showShapingOptions = async (e) => {
    setMenuComponent("shaping");
  };

  const showPointer = (e) => {
    setMenuComponent("usePointer");
  };

  const useHand = (e) => {
    setMenuComponent("useHand");
  };
  const showMediaOptions = (e) => {
    setIsUploadModal(true);
    setMenuComponent("media_upload");
  };
  const addNote = () => {
    setIsNoteModal(true);
    setMenuComponent("noting");
  };

  const createNewNote = (e) => {
    e.preventDefault();
    const newNote = {
      type: 'note',
      id: nextId('note-'),
      label: {
        x: 350,
        y: 250,
        opacity: 0.75,
      },
      tag: {
        color: noteColor,
      },
      content: {
        text: noteTxt,
        font: "Calibri",
        size: 18,
        padding: 5,
        fill: "black",
      },
    };

    elementDispatch({ type: "CREATE_NOTE", payload: newNote });
    setNoteColor(null);
    setNoteTxt(null)
    setIsNoteModal(false);
    // setNotes()
  };

  
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = selectedFile.map((file) => URL.createObjectURL(file));
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const fileArray = Array.from(e.target.files);
    setSelectedFile(fileArray);
    const reader = new FileReader();
    reader.onload = () => {
      const imageObj = {
        type: 'file',
        id: nextId('file-'),
        src: reader.result,
      };
      elementDispatch({ type: "CREATE_FILE", payload: imageObj });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div className="overlay">
      <div className="tool_item">
        <Button className="tool_btn" type="text">
          <PointerIcon className="svg_icon" onClick={showPointer} />
        </Button>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text" onClick={showDrawingOptions}>
          <EditIcon className="svg_icon" />
        </Button>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text">
          <EraserIcon
            className="svg_icon"
            onClick={() => {
              setMenuComponent("drawing");
              setDrawingProperty((prev) => ({
                ...prev,
                brushColor: "#ffffff",
                brushStroke: "10",
              }));
            }}
          />
        </Button>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text">
          <TypingIcon className="svg_icon" onClick={showTypingOptions} />
        </Button>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text">
          <ShapeIcon className="svg_icon" onClick={showShapingOptions} />
        </Button>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text" onClick={showMediaOptions}>
          <MediaIcon className="svg_icon" />
        </Button>
        <Drawer
          title="Media Upload"
          placement="left"
          closable={false}
          onClose={() => setIsUploadModal(false)}
          visible={isUploadModal}
          width={350}
        >
          <form className="file-select-frm">
            <input
              className="custom-file-input"
              type="file"
              accept="image/*"
              onChange={onSelectFile}
            />
            {preview &&
              preview.map((photoPreview) => (
                <img
                  className="photo_preview"
                  key={photoPreview}
                  src={photoPreview}
                  alt="upload_media"
                  draggable={true}
                  onDragStart={(e) => {
                    dragUrl.current = e.target.src;
                  }}
                />
              ))}
            {/* <label htmlFor="customFile">
								<Button
									className="btn-center"
									variant="contained"
									color="default"
									component="span"
								>
									Upload
								</Button>
							</label> */}
          </form>
        </Drawer>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text" onClick={addNote}>
          <NoteIcon className="svg_icon" />
        </Button>
        <Modal
          title="Create new note"
          bodyStyle={{ height: 300 }}
          style={{ textAlign: "center" }}
          centered
          visible={isNoteModal}
          onOk={createNewNote}
          okText="Create"
          onCancel={() => setIsNoteModal(false)}
          keyboard
        >
          <ColorPicker mainColors={noteColors} setColor={setNoteColor} />
          <br />
          <NotePaper color={noteColor} setNoteTxt={setNoteTxt} />
        </Modal>
      </div>
      <div className="tool_item">
        <Button className="tool_btn" type="text" onClick={useHand}>
          <i className="far fa-hand-paper" id="hand_svg"></i>
        </Button>
      </div>
    </div>
  );
};

export default OverlayMenu;
