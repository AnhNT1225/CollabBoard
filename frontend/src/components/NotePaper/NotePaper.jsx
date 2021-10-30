import React, {useRef} from 'react';
import './notepaper.scss';
const NotePaper = (props) => {
    const {color, setNoteTxt} = props;
    const textRef = useRef()
    const handleChangeText = async(e) => {
        textRef.current = await e.target.value;
        setNoteTxt(textRef.current)
    }
    return (
        <div className="note_wrap" >
        <textarea 
        style={{backgroundColor: `${color}`}} 
        className="text_wrap" 
        placeholder="Enter something here"
        onChange={handleChangeText}
        value={textRef.current}
        />
      </div>
    );
};

export default NotePaper;