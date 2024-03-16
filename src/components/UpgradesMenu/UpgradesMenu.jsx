
import React, { useState, useContext } from "react";
import { UpgradesStateContext, ScoreStateContext } from "../../App";
import styles from "./UpgradesMenu.module.css";

export default function Upgrades() {
    const [isTabOpened, setIsTabOpened] = useState(false);

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
            gameScore.setScore(s => Math.floor(s - price));
        }
        
        gameUpgrades.setUpgrades(u => [... gameUpgrades.upgrades]);
    }


    const body = <>
        <p className={styles.title}>UPGRADES</p>

        {gameUpgrades.upgrades.map((category, index) => <div className={styles.upgradeCategory} key={index}>
            <p className={styles.categoryName}>{category.categoryName}</p>
            <ul>
                {category.upgradeList.map((upgrade, i) => !upgrade.getIsMaxed() ? <li className={styles.upgradeItem} key={`${index}-${i}`}>
                    {upgrade.getName()} (lvl:{upgrade.getCurrentLevel()}) <button className={styles.buyButton} onClick={() => handleBuyUpgrade(index, i)}>Buy for {upgrade.calculatePrice()} score</button>
                </li> : "")}
            </ul>
        </div>)}
    </>


    return <div className={styles.Upgrades}>
        <button className={styles.toggleButton} onClick={handleTabToggle}>Upgrades</button>
        {isTabOpened ? body : ""}
    </div>
}