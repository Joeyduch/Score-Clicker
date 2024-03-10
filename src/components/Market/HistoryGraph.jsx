
import React, { useState, useRef, useEffect, useContext } from "react";
import { PriceHistoryContext } from "./Market";
import styles from "./HistoryGraph.module.css";

function HistoryGraph() {
    const priceHistory = useContext(PriceHistoryContext);

    const canvasRef = useRef(undefined);

    const drawStyles = {
        color: "darkgreen",
        pointSize: 2,
    }


    const drawHistoryOnCanvas = (history, canvas) => {
        const context = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        const unitWidth = history.length <= 1 ? width : width / history.length;

        const maxPrice = Math.max(... history);
        const minPrice = Math.min(... history);

        context.clearRect(0,0, width, height);

        for(let i=0; i<history.length; i++) {
            const priceToHeight = _price =>  height-(height*(_price-minPrice)/(maxPrice-minPrice));
            
            const price = history[i];
            const size = drawStyles.pointSize;
            const graphPosition = {
                x: unitWidth * i,
                y: priceToHeight(price)
            }

            // draw circle
            context.fillStyle = drawStyles.color;
            context.beginPath();
            context.arc(graphPosition.x, graphPosition.y, size, 0, 2*Math.PI);
            context.fill();

            // draw line
            if(i >= 1) {
                context.strokeStyle = drawStyles.color;
                context.beginPath();
                context.moveTo(unitWidth*(i-1), priceToHeight(history[i-1]));
                context.lineTo(graphPosition.x, graphPosition.y);
                context.stroke();
            }
        }
    }


    useEffect(() => {
        const canvas = canvasRef.current;
        if(!canvas || !priceHistory) return;
        drawHistoryOnCanvas(priceHistory, canvas);
    }, [priceHistory]);

    return (
        <div className={styles.HistoryGraph}>
            <canvas ref={canvasRef}></canvas>
            <p>Price History</p>
            <p>{priceHistory.map((value, index) => (index===0 ? "" : ", ") + value)}</p>
        </div>
    )
}



export default HistoryGraph;