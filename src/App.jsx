
// APIs
import { useState, useRef, useEffect, createContext} from 'react';

// classes
import UpgradeList, {Upgrade} from './classes/Upgrades';
import MarketManager from "./classes/MarketManager";

// components
import UpgradesMenu from "./components/UpgradesMenu/UpgradesMenu";
import ClickArea from './components/ClickArea/ClickArea';
import Market from './components/Market/Market';

// CSS
import './App.css';



// Context
export const ScoreStateContext = createContext(undefined);
export const UpgradesStateContext = createContext(undefined);
export const MarketManagerContext = createContext(undefined);



export default function App() {
  const [score, setScore] = useState(0);

  const [isOptionsShown, setIsOptionsShown] = useState(false);

  const [upgrades, setUpgrades] = useState(new UpgradeList([
    new Upgrade("clickValue", "Click Value", 5, 2),
    new Upgrade("marketEasy", "Access Ticket Market (easy)", 20, 1, 1),
    new Upgrade("marketMedium", "Access TixCoin Market (medium)", 800, 1, 1),
    new Upgrade("marketHard", "Access Golden-T Market (hard)", 5000, 1, 1),
    new Upgrade("marketHistoryLifespan", "Price History Lifespan", 10, 1.2, 20),
  ]));

  const [marketManager, setMarketManager] = useState(new MarketManager([
    {name:"ticket", basePrice:50, priceMinimum:10, priceMaximum:100, priceInfluence:5, neededUpgradeIdentifier:"marketEasy"},
    {name:"tix-coin", basePrice:750, priceMinimum:500, priceMaximum:1000, priceInfluence:50, neededUpgradeIdentifier:"marketMedium"},
    {name:"golden-t", basePrice:5000, priceMinimum:2000, priceMaximum:10000, priceInfluence:100, neededUpgradeIdentifier:"marketHard"},
  ]));

  const marketsKeyRef = useRef(0); // used to force re-render of markets


  // save / load / clear save-game
  const localStorageSave = () => {
    localStorage.setItem("score", score);
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
    localStorage.setItem("markets", JSON.stringify(marketManager.list));

    // post-saving
    setIsOptionsShown(o => false);
    console.log("--GAME SAVED--");
  }


  const localStorageLoad = () => {
    if(localStorage.length <= 0) {
      console.warn("No data to load in localStorage");
      return;
    }

    const storageScore = localStorage.getItem("score");
    const storageUpgrades = JSON.parse(localStorage.getItem("upgrades"));
    const storageMarkets = JSON.parse(localStorage.getItem("markets"));
    
    // load score
    if(storageScore!==null) setScore(s => Number(storageScore));

    // load upgrades
    if(storageUpgrades!==null) {
      const updatedArray = [];

      storageUpgrades.list.forEach((storedUpgrade, index) => {
        updatedArray.push(new Upgrade(
          storedUpgrade.identifier,
          storedUpgrade.name,
          Number(storedUpgrade.basePrice),
          Number(storedUpgrade.priceMultiplier),
          Number(storedUpgrade.maxLevel)
        ));
        updatedArray[index].levelUp(storedUpgrade.currentLevel);
        updatedArray[index].setIsMaxed(storedUpgrade.isMaxed);
      });

      upgrades.setList([... updatedArray]);
    };

    // load markets
    marketsKeyRef.current += 1;
    setMarketManager(m => new MarketManager([... storageMarkets]));

    // post-loading
    setIsOptionsShown(o => false);
    console.log("--GAME LOADED--");
  }


  const localStorageClear = () => {
    localStorage.clear();
    location.reload();

    console.log("--GAME RESET--");
  }


  // toggles
  const handleOptionsToggle = () => {
    setIsOptionsShown(o => !o);
  }


  

  
  // autoload save-game on App mount
  useEffect(() => {
    if(localStorage.length > 0) localStorageLoad();
    else console.log("--NEW GAME--");
  }, []);


  return (
    <div className="App">
      <p className="score">$core: {score}</p>
      
      <ScoreStateContext.Provider value={{score, setScore}}>
        <UpgradesStateContext.Provider value={{upgrades, setUpgrades}}>
          <UpgradesMenu />
          <ClickArea />

          <MarketManagerContext.Provider value={marketManager}>
            {/* Generate each markets if they are unlocked */}
            {marketManager.list.map((market, index) =>
              (upgrades.getByIdentifier(market.neededUpgradeIdentifier) && upgrades.getByIdentifier(market.neededUpgradeIdentifier).getIsMaxed())
                ? <Market key={`${index}_${marketsKeyRef.current}`} marketIndex={index}/>
                : ""
            )}
          </MarketManagerContext.Provider>
          
        </UpgradesStateContext.Provider>
      </ScoreStateContext.Provider>

      <div className="optionsArea">
        <button onClick={handleOptionsToggle} className="optionsToggle">⚙️</button>
        {isOptionsShown ? <>
          <div className="options">
            <button className="optionsButtonLoad" onClick={localStorageLoad}>Load Game</button>
            <button className="optionsButtonSave" onClick={localStorageSave}>Save Game</button>
            <button className="optionsButtonReset" onClick={localStorageClear}>Reset Game</button>
          </div>
        </> : ""}
      </div>
      

      <footer>
        <p className="copyrights">&#169; Joey Ducharme - 2024</p>
      </footer>
    </div>
  )
}





