
import React, { useState, useRef, useEffect, useContext } from "react";
import { PriceHistoryContext } from "./Market";
import styles from "./HistoryGraph.module.css";

function HistoryGraph() {
    const [priceHighest, setPriceHighest] = useState(0);
    const [priceLowest, setPriceLowest] = useState(0);

    const priceHistory = useContext(PriceHistoryContext);

    const canvasRef = useRef(undefined);

    const drawStyles = {
        color: "black",
        colorProfit: "green",
        colorLoss: "red",
        pointSize: 3,
    }


    const drawHistoryOnCanvas = (history, canvas) => {
        const context = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        const unitWidth = history.length <= 1 ? width : width / history.length;

        const _priceHighest = Math.max(... history); // using instant constant or else there is a delay in the
        const _priceLowest = Math.min(... history); // state value update for the canvas

        context.clearRect(0,0, width, height);

        for(let i=0; i<history.length; i++) {
            const priceToHeight = _price =>  height-(height*(_price-_priceLowest)/(_priceHighest-_priceLowest));
            
            const price = history[i];
            const size = drawStyles.pointSize;
            const graphPosition = {
                x: unitWidth * i,
                y: priceToHeight(price)
            }

            const isProfit = i >= 1 && history[i] >= history[i-1];

            // draw circle
            context.fillStyle = isProfit ? drawStyles.colorProfit : drawStyles.colorLoss;
            context.beginPath();
            context.arc(graphPosition.x, graphPosition.y, size, 0, 2*Math.PI);
            context.fill();

            // draw line
            if(i >= 1) {
                context.strokeStyle = isProfit ? drawStyles.colorProfit : drawStyles.colorLoss;
                context.beginPath();
                context.moveTo(unitWidth*(i-1), priceToHeight(history[i-1]));
                context.lineTo(graphPosition.x, graphPosition.y);
                context.stroke();
            }
        }
    }


    const resizeCanvasDOM = () => {
        const canvas = canvasRef.current;
        if(!canvas) return;

        canvas.width = canvas.getBoundingClientRect().width;
        canvas.height = canvas.getBoundingClientRect().height;
    }


    // Resize canvas events
    useEffect(() => {
        resizeCanvasDOM();

        window.addEventListener("resize", resizeCanvasDOM);
        return(() => {
            window.removeEventListener("resize", resizeCanvasDOM);
        });
    }, [])


    // Update on priceHistory change (Draw canvas + high/low update)
    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas || !priceHistory) return;

        // update new highest / lowest prices
        setPriceHighest(Math.max(... priceHistory));
        setPriceLowest(Math.min(... priceHistory));

        // canvas draw
        drawHistoryOnCanvas(priceHistory, canvas);
    }, [priceHistory]);


    return (
        <div className={styles.HistoryGraph}>
            <div className={styles.canvasArea}>
                <canvas ref={canvasRef} className={styles.canvas}></canvas>
                <p className={styles.canvas_numberHighest}>High: {priceHighest}</p>
                <p className={styles.canvas_numberLowest}>Low: {priceLowest}</p>
            </div>
        </div>
    )
}



export default HistoryGraph;