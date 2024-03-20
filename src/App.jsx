
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
  // state values
  const [score, setScore] = useState(0);

  const [isOptionsShown, setIsOptionsShown] = useState(false);

  const [options, setOptions] = useState({
    isAutosaveEnabled: true,
    autosaveCooldownSeconds: 10,
  });
  
  const [autosaveTimerCycle, setAutosaveTimerCycle] = useState(0); // to properly auto-save

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

  // reference values
  const marketsKeyRef = useRef(0); // used to force re-render of markets



  // save / load / clear save-game
  const localStorageSave = (closeOptionsMenu=true) => {
    localStorage.setItem("score", score);
    localStorage.setItem("options", JSON.stringify(options));
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
    localStorage.setItem("markets", JSON.stringify(marketManager.list));

    // post-saving
    if(closeOptionsMenu) setIsOptionsShown(os => false);
    console.log("--GAME SAVED--");
  }


  const localStorageLoad = (closeOptionsMenu=true) => {
    if(localStorage.length <= 0) {
      console.warn("No data to load in localStorage");
      return;
    }

    const storageScore = localStorage.getItem("score");
    const storageOptions = JSON.parse(localStorage.getItem("options"));
    const storageUpgrades = JSON.parse(localStorage.getItem("upgrades"));
    const storageMarkets = JSON.parse(localStorage.getItem("markets"));
    
    // load score
    if(storageScore!==null) setScore(s => Number(storageScore));

    // load options
    if(storageOptions!==null) setOptions(o => {return {... storageOptions}});

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
    if(closeOptionsMenu) setIsOptionsShown(os => false);
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

  const handleAutosaveToggle = () => {
    setOptions(o => {return {... options, isAutosaveEnabled:!options.isAutosaveEnabled}})

    // save new options
    localStorage.setItem("options", JSON.stringify({... options, isAutosaveEnabled:!options.isAutosaveEnabled}))
  }


  // autoload
  useEffect(() => {
    if(localStorage.length > 0) localStorageLoad();
    else console.log("--NEW GAME--");
  }, []);


  // enable auto-save
  useEffect(() => {
    const intervalId = setInterval(() => {
      setAutosaveTimerCycle(c => c + 1);
    }, options.autosaveCooldownSeconds * 1000 || 10000);

    return(() => {
      clearInterval(intervalId);
    })
  }, []);

  useEffect(() => {
    if(!options.isAutosaveEnabled || autosaveTimerCycle===0) return;
    console.log("--AUTOSAVE--");
    localStorageSave(false);
  }, [autosaveTimerCycle]);


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
        <button onClick={handleOptionsToggle} className="buttonRoundOption">💾</button>
        {isOptionsShown ? <>
          <div className="options">
            {options.isAutosaveEnabled ? <button onClick={handleAutosaveToggle}>Autosave Enabled</button> : <button onClick={handleAutosaveToggle}>Autosave Disabled</button>}
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





