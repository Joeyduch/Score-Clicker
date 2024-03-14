
import React, {useRef, useState, useEffect, useContext} from "react";
import { ScoreStateContext, UpgradesStateContext } from "../../App";
import styles from "./Clicker.module.css";



function Clicker(props) {
    const [position, setPosition] = useState({x:0, y: 0});
    const [clickValue, setClickValue] = useState(1);

    const buttonRef = useRef(undefined);

    const gameScore = useContext(ScoreStateContext);
    const gameUpgrades = useContext(UpgradesStateContext);


    const handleClick = () => {
        // change position
        changePosition();

        // handle onClick event if there is any
        if(gameScore) gameScore.setScore(s => s + clickValue);

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


    // On Mount
    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);

        return(() => {window.removeEventListener("resize", handleWindowResize)});
    }, [])


    // On Render
    useEffect(() => {
        const upgrade = gameUpgrades.upgrades[0].upgradeList[0]
        setClickValue(c => 1 + upgrade.getCurrentLevel());
    })


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