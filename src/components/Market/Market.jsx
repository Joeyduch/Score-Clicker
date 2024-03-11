
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { ScoreStateContext } from "../../App";
import HistoryGraph from "./HistoryGraph";
import styles from "./Market.module.css";


export const PriceHistoryContext = createContext([]);


function Market() {
    // ticket data
    const [ticketPrice, setTicketPrice] = useState(50);
    const [ticketAmount, setTicketAmount] = useState(0);

    const [priceMaximum, setPriceMaximum] = useState(100);
    const [priceMinimum, setPriceMinimum] = useState(10);
    const [priceChangeForce, setPriceChangeForce] = useState(5);

    // buy total data
    const [buyAmount, setBuyAmount] = useState(1);
    const [buyPrice, setBuyPrice] = useState(0);

    // buy/sell averages
    const [totalBought, setTotalBought] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [buyAverage, setBuyAverage] = useState(0);

    const [totalSold, setTotalSold] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [sellAverage, setSellAverage] = useState(0);

    // price history
    const [priceHistory, setPriceHistory] = useState([]);
    const [historyTimestamp, setHistoryTimestamp] = useState(0);
    const [priceHistoryLifespan, setPriceHistoryLifespan] = useState(20);

    // misc
    const [marketSpeed, setMarketSpeed] = useState(1000); // miliseconds
    const [isGraphVisible, setIsGraphVisible] = useState(true);

    // context values
    const gameScore = useContext(ScoreStateContext);

    
    const handleBuy = () => {
        if(gameScore.score < buyPrice) return;
        gameScore.setScore(s => s - buyPrice);
        setTicketAmount(a => a + Number(buyAmount));

        setTotalBought(b => b + Number(buyAmount));
        setTotalExpenses(e => e + Number(buyPrice));
    }

    const handleSell = () => {
        if(ticketAmount < buyAmount) return;
        gameScore.setScore(s => s + buyPrice);
        setTicketAmount(a => a - buyAmount);

        setTotalSold(s => s + Number(buyAmount));
        setTotalIncome(i => i + Number(buyPrice));
    }

    const handleAmountInput = (event) => {
        const newAmount = event.target.value > 0 ? event.target.value : 1;
        setBuyAmount(b => newAmount);
    }


    const handleGraphToggle = () => {
        setIsGraphVisible(v => !v);
    }


    const calculatePriceChange = () => {
        if((priceMaximum-priceMinimum) / 2 < priceChangeForce) {
            console.warn("priceMaximum and priceMinimum values' difference is smaller than priceChangeForce, price may go out of bound");
        } // could put this error handling somewhere else...

        // calculate new priceChange value
        const getRandomPriceChange = () => Math.round(-priceChangeForce + Math.random()*(priceChangeForce*2));
        let priceChange = getRandomPriceChange();

        // making sure the price change is in range, if price is way out of range by a bug, it will correct towards range
        const isPriceChangeOutOfRange = () => {
            const isChangeTooLow = priceChange < 0 && ticketPrice + priceChange < priceMinimum;
            const isChangeTooHigh = priceChange > 0 && ticketPrice + priceChange > priceMaximum;

            return isChangeTooLow || isChangeTooHigh;
        }

        if(isPriceChangeOutOfRange()) {
            priceChange *= -1;
        }

        // set the new price
        setTicketPrice(p => p + priceChange);
    }


    const updatePriceHistory = () => {
        const history = [... priceHistory];

        if(history.length >= priceHistoryLifespan) {
            history.splice(0, history.length - priceHistoryLifespan + 1);
        }
        history.push(ticketPrice);

        setPriceHistory([... history]);
    }


    // Update buy price
    useEffect(() => {
        setBuyPrice(p => ticketPrice * buyAmount);
    }, [ticketPrice, buyAmount])


    // Update buy/sell average
    useEffect(() => {
        const average = totalExpenses / totalBought;
        setBuyAverage(average || 0);
    }, [totalBought, totalExpenses]);

    useEffect(() => {
        const average = totalIncome / totalSold;
        setSellAverage(average || 0);
    }, [totalSold, totalIncome]);


    // Update price history
    useEffect(() => {
        updatePriceHistory();
    }, [ticketPrice, historyTimestamp])


    // Market up - down
    useEffect(() => {
        const intervalId = setInterval(() => {
            calculatePriceChange();
            setHistoryTimestamp(t => (t + 1) % Number.MAX_SAFE_INTEGER);
        }, marketSpeed);

        return(() => {
            clearInterval(intervalId);
        });
    }, [ticketPrice])


    return (
        <div className={styles.Market}>
            <p className={styles.title}>TICKET-MARKET</p>
            <p>You have <span className={styles.accentText}>{ticketAmount}</span> Tickets</p>
            <p className={styles.price}>Ticket price: <span className={styles.priceNumber}>{ticketPrice}</span> Score</p>

            <label className={styles.amountInputArea}>
                Buy / Sell amount: <input onChange={(e)=>handleAmountInput(e)} type="number" value={buyAmount}/>
            </label>

            <div className={styles.buyOptions}>
                <button className={styles.buttonBuy} onClick={handleBuy}>Buy {buyAmount} Ticket for {buyPrice} Score</button>
                <button className={styles.buttonSell} onClick={handleSell}>Convert {buyAmount} Ticket into {buyPrice} Score</button>
            </div>
            
            <div className={styles.averagesArea}>
                <p>Average buy price: <span className={styles.accentText}>{buyAverage.toFixed(2)}</span></p>
                <p>Average sell price: <span className={styles.accentText}>{sellAverage.toFixed(2)}</span></p>
            </div>
            

            <button onClick={handleGraphToggle} className={styles.buttonGraphToggle}>Toggle Graph</button>
            <PriceHistoryContext.Provider value={priceHistory}>
                {isGraphVisible ? <HistoryGraph /> : ""}
            </PriceHistoryContext.Provider>
        </div>
    )
}



export default Market;
