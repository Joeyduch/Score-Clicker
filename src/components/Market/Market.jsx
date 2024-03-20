
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";
import { ScoreStateContext, UpgradesStateContext, MarketManagerContext } from "../../App";
import HistoryGraph from "./HistoryGraph";
import styles from "./Market.module.css";


export const PriceHistoryContext = createContext([]);


function Market(props) {
    // ticket data
    const [ticketName, setTicketName] = useState("Default");
    const [ticketPrice, setTicketPrice] = useState(2);
    const [ticketAmount, setTicketAmount] = useState(0);

    const [priceMaximum, setPriceMaximum] = useState(3);
    const [priceMinimum, setPriceMinimum] = useState(1);
    const [priceChangeInfluence, setPriceChangeInfluence] = useState(1);

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
    const [priceHistoryLifespan, setPriceHistoryLifespan] = useState(0);
    const [basePriceHistoryLifespan, setBasePriceHistoryLifespan] = useState(10);

    // misc
    const [marketSpeed, setMarketSpeed] = useState(1000); // miliseconds

    // ref values
    const marketIndexRef = useRef(props.marketIndex !== null ? props.marketIndex : -1);

    // context values
    const gameScore = useContext(ScoreStateContext);
    const gameUpgrades = useContext(UpgradesStateContext);
    const gameMarketManager = useContext(MarketManagerContext);

    
    const handleBuy = () => {
        if(gameScore.score < buyPrice) return;

        gameScore.setScore(s => s - buyPrice);
        setTicketAmount(a => a + Number(buyAmount));

        setTotalBought(b => b + Number(buyAmount));
        setTotalExpenses(e => e + Number(buyPrice));

        if(gameMarketManager) { // save to context data
            const marketCurrent = gameMarketManager.getMarketByIndex(marketIndexRef.current);
            marketCurrent.amount += Number(buyAmount);
            marketCurrent.totalBought += Number(buyAmount);
            marketCurrent.totalExpenses += Number(buyPrice);
        }
    }

    const handleSell = () => {
        if(ticketAmount < buyAmount) return;
        gameScore.setScore(s => s + buyPrice);
        setTicketAmount(a => a - buyAmount);

        setTotalSold(s => s + Number(buyAmount));
        setTotalIncome(i => i + Number(buyPrice));

        if(gameMarketManager) { // save to context data
            const marketCurrent = gameMarketManager.getMarketByIndex(marketIndexRef.current);
            marketCurrent.amount -= Number(buyAmount);
            marketCurrent.totalSold += Number(buyAmount);
            marketCurrent.totalIncome += Number(buyPrice);
        }
    }

    const handleAmountInput = (event) => {
        const newAmount = event.target.value >= 0 ? event.target.value : 1;
        setBuyAmount(b => Math.floor(newAmount));
    }


    const handleResetAverageBuy = () => {
        setTotalBought(b => 0);
        setTotalExpenses(e => 0);

        if(gameMarketManager) { // save to context data
            const marketCurrent = gameMarketManager.getMarketByIndex(marketIndexRef.current);
            marketCurrent.totalBought = 0;
            marketCurrent.totalExpenses = 0;
        }
    }


    const handleResetAverageSell = () => {
        setTotalSold(s => 0);
        setTotalIncome(i => 0);

        if(gameMarketManager) { // save to context data
            const marketCurrent = gameMarketManager.getMarketByIndex(marketIndexRef.current);
            marketCurrent.totalSold = 0;
            marketCurrent.totalIncome = 0;
        }
    }


    const calculatePriceChange = () => {
        // warnings
        if(priceMinimum > priceMaximum) {
            console.warn("priceMaximum is lower than priceMinimum");
        }
        if((priceMaximum-priceMinimum) / 2 < priceChangeInfluence) {
            console.warn("priceMaximum and priceMinimum values' difference is smaller than priceChangeInfluence, price may go out of bound");
        }

        // calculate new priceChange value
        const getRandomPriceChange = () => Math.round(-priceChangeInfluence + Math.random()*(priceChangeInfluence*2));
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

        if(gameMarketManager) { // save to context data
            const marketCurrent = gameMarketManager.getMarketByIndex(marketIndexRef.current);
            marketCurrent.basePrice += Number(priceChange);
        }
    }


    const updatePriceHistory = () => {
        const history = [... priceHistory];

        if(history.length >= priceHistoryLifespan) {
            history.splice(0, history.length - priceHistoryLifespan + 1);
        }
        history.push(ticketPrice);

        setPriceHistory([... history]);
    }


    const updatePriceHistoryLifespan = () => {
        const historyLifespanUpgrade = gameUpgrades.upgrades.getByIdentifier("marketHistoryLifespan").getCurrentLevel();
        setPriceHistoryLifespan(basePriceHistoryLifespan + historyLifespanUpgrade);
    }


    // Update buy price
    useEffect(() => {
        setBuyPrice(p => ticketPrice * buyAmount);
    }, [ticketPrice, buyAmount])


    // Update buy/sell average
    useEffect(() => {
        const average = totalExpenses / totalBought;
        setBuyAverage(average || 0);
    }, [totalBought, totalExpenses])

    useEffect(() => {
        const average = totalIncome / totalSold;
        setSellAverage(average || 0);
    }, [totalSold, totalIncome])


    // Update price history
    useEffect(() => {
        updatePriceHistory();
    }, [ticketPrice, historyTimestamp])


    // Market up - down + PriceHistoryLifespan update
    useEffect(() => {
        const intervalId = setInterval(() => {
            updatePriceHistoryLifespan();
            calculatePriceChange();
            setHistoryTimestamp(t => (t + 1) % Number.MAX_SAFE_INTEGER);
        }, marketSpeed);

        return(() => {
            clearInterval(intervalId);
        });
    }, [ticketPrice])


    // On mount
    useEffect(() => {
        // load market from context data
        if(gameMarketManager) {
            const marketCurrent = gameMarketManager.getMarketByIndex(marketIndexRef.current);
            setTicketName(n => marketCurrent.name);
            setTicketPrice(p => marketCurrent.basePrice);
            setPriceMinimum(min => marketCurrent.priceMinimum);
            setPriceMaximum(max => marketCurrent.priceMaximum);
            setPriceChangeInfluence(i => marketCurrent.priceInfluence);
            setTicketAmount(a => marketCurrent.amount);

            setTotalBought(tb => marketCurrent.totalBought);
            setTotalExpenses(te => marketCurrent.totalExpenses);
            setTotalSold(ts => marketCurrent.totalSold);
            setTotalIncome(ti => marketCurrent.totalIncome);
        }
    }, [])


    return (
        <div className={styles.Market}>
            <p className={styles.title}>{ticketName.toUpperCase()} MARKET</p>
            <p>You have <span className={styles.accentText}>{ticketAmount}</span> {ticketName}(s)</p>
            <p className={styles.price}>{ticketName} price: <span className={styles.priceNumber}>{ticketPrice}</span> Score</p>

            <label className={styles.amountInputArea}>
                Buy / Sell amount: <input className={styles.amountInput} onChange={(e)=>handleAmountInput(e)} type="number" value={buyAmount}/>
            </label>

            <div className={styles.buyOptions}>
                <button className={styles.buttonBuy} onClick={handleBuy}>Buy {buyAmount} {ticketName}(s) for <span className={styles.accentText}>{buyPrice}</span> Score</button>
                <button className={styles.buttonSell} onClick={handleSell}>Sell {buyAmount} {ticketName}(s) for <span className={styles.accentText}>{buyPrice}</span> Score</button>
            </div>
            
            <div className={styles.averagesArea}>
                <p>Average buy price: <span className={styles.accentText}>{buyAverage.toFixed(2)}</span></p>
                <p>Average sell price: <span className={styles.accentText}>{sellAverage.toFixed(2)}</span></p>
            </div>
            
            <div className={styles.optionsArea}>
                <button onClick={handleResetAverageBuy} className={styles.optionsButton}>Reset Average Buy</button>
                <button onClick={handleResetAverageSell} className={styles.optionsButton}>Reset Average Sell</button>
            </div>
            
            <PriceHistoryContext.Provider value={priceHistory}>
                <HistoryGraph />
            </PriceHistoryContext.Provider>
        </div>
    )
}



Market.propTypes = {
    name: PropTypes.string,
    priceStart: PropTypes.number,
    priceMaximum: PropTypes.number,
    priceMinimum: PropTypes.number,
    priceInfluence: PropTypes.number,
}



export default Market;
