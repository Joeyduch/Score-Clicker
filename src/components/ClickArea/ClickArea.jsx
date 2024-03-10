
import React, {useState, useRef, useEffect} from "react";
import Clicker from "./Clicker";
import styles from "./ClickArea.module.css";



function ClickArea() {
    const [size, setSize] = useState({width:0, height:0});

    const clickAreaRef = useRef(undefined);

    
    // Click area resize
    const handleResize = () => {
        setSize(c => ({
        width: clickAreaRef.current.offsetWidth,
        height: clickAreaRef.current.offsetHeight
        }));
    }


    useEffect(() => {
        if(!clickAreaRef.current) return;

        handleResize();
        window.addEventListener("resize", handleResize);

        return (() => {
        window.removeEventListener("resize", handleResize);
        })
    }, []);


    return (
        <div ref={clickAreaRef} className={styles.ClickArea}>
            <Clicker containerSize={size}/>
            <p className={styles.decorationText}>CLICKER ZONE</p>
        </div>
    )
}



export default ClickArea;