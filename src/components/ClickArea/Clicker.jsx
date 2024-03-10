
import React, {useRef, useState, useEffect, useContext} from "react";
import { ScoreStateContext } from "../../App";
import styles from "./Clicker.module.css";



function Clicker(props) {
    const [position, setPosition] = useState({x:0, y: 0});

    const buttonRef = useRef(undefined);

    const gameScore = useContext(ScoreStateContext);


    const handleClick = () => {
        // change position
        changePosition();

        // handle onClick event if there is any
        if(gameScore) gameScore.setScore(s => s + 1);

        // unfocus button
        if(buttonRef) buttonRef.current.blur();
    }

    const changePosition = () => {
        const width = buttonRef.current ? buttonRef.current.offsetWidth : 0;
        const height = buttonRef.current ? buttonRef.current.offsetHeight : 0;
        const maxX = width + (props.containerSize.width - width*2);
        const maxY = height + (props.containerSize.height - height*2);
        const newX = Math.floor(Math.random()*maxX);
        const newY = Math.floor(Math.random()*maxY);
        setPosition(p => ({x: newX, y: newY}));
    }

    const handleWindowResize = () => {
        setPosition(p => ({x:0, y:0}));
    }


    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return(() => {window.removeEventListener("resize", handleWindowResize)});
    }, []);


    return (
        <button ref={buttonRef} onClick={handleClick} style={{left:position.x, top: position.y}} className={styles.Clicker}>
            CLICK
        </button>
    )
}



Clicker.defaultProps = {
    containerSize: {width: 0, height: 0},
    onClick: undefined,
}



export default Clicker;