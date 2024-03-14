
import React, { useState, useContext } from "react";
import { UpgradesStateContext, ScoreStateContext } from "../../App";
import styles from "./UpgradesMenu.module.css";

export default function Upgrades() {
    const [isTabOpened, setIsTabOpened] = useState(true);

    const gameScore = useContext(ScoreStateContext);
    const gameUpgrades = useContext(UpgradesStateContext);


    const handleTabToggle = () => {
        setIsTabOpened(t => !t);
    }

    const handleBuyUpgrade = (categoryIndex, upgradeIndex) => {
        if(isNaN(categoryIndex), isNaN(upgradeIndex)) {
            console.error("invalid indexes at function handleBuyUpgrade");
            return;
        }

        const upgrade = gameUpgrades.upgrades[categoryIndex].upgradeList[upgradeIndex];
        const price = upgrade.calculatePrice();
        if(gameScore.score >= price) {
            upgrade.levelUp();
            gameScore.setScore(s => s - price);
        }
        
        gameUpgrades.setUpgrades(u => [... gameUpgrades.upgrades]);
    }


    const body = <>
        <p className={styles.title}>Upgrades</p>

        {gameUpgrades.upgrades.map((category, index) => <div key={index}>
            <p>{category.categoryName}</p>
            <ul>
                {category.upgradeList.map((upgrade, i) => <li key={`${index}-${i}`}>
                    (lvl:{upgrade.getCurrentLevel()}) {upgrade.getName()} <button onClick={() => handleBuyUpgrade(index, i)}>Buy for {upgrade.calculatePrice()} score</button>
                </li>)}
            </ul>
        </div>)}
    </>


    return <div className={styles.Upgrades}>
        <button onClick={handleTabToggle}>Toggle</button>
        {isTabOpened ? body : ""}
    </div>
}