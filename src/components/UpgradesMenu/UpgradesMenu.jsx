
import React, { useState, useContext } from "react";
import UpgradeList from "../../classes/Upgrades";
import { UpgradesStateContext, ScoreStateContext } from "../../App";
import styles from "./UpgradesMenu.module.css";

export default function Upgrades() {
    const [isTabOpened, setIsTabOpened] = useState(false);

    const gameScore = useContext(ScoreStateContext);
    const gameUpgrades = useContext(UpgradesStateContext);


    const handleTabToggle = () => {
        setIsTabOpened(t => !t);
    }

    const handleBuyUpgrade = (upgradeIndex) => {
        if(isNaN(upgradeIndex)) {
            console.error("invalid indexes at function handleBuyUpgrade");
            return;
        }

        const upgrade = gameUpgrades.upgrades.getList()[upgradeIndex];
        const price = upgrade.calculatePrice();
        if(gameScore.score >= price) {
            upgrade.levelUp();
            gameScore.setScore(s => Math.floor(s - price));
        }
        
        gameUpgrades.setUpgrades(u => new UpgradeList(gameUpgrades.upgrades.getList()));
    }


    const body = <>
        <p className={styles.title}>UPGRADES</p>
        <ul className={styles.upgradeList}>
            {gameUpgrades.upgrades.getList().map((upgrade, i) => !upgrade.getIsMaxed() ? <li className={styles.upgradeItem} key={`${i}`}>
                {upgrade.getName()} (lvl:{upgrade.getCurrentLevel()}) <button className={styles.buyButton} onClick={() => handleBuyUpgrade(i)}>Buy for {upgrade.calculatePrice()} score</button>
            </li> : "")}
        </ul>
    </>


    return <div className={styles.Upgrades}>
        <button className={styles.toggleButton} onClick={handleTabToggle}>Upgrades</button>
        {isTabOpened ? body : ""}
    </div>
}