
// APIs
import { useState, useRef, createContext} from 'react';

// classes
import Upgrade from './classes/Upgrade';

// components
import UpgradesMenu from "./components/UpgradesMenu/UpgradesMenu";
import ClickArea from './components/ClickArea/ClickArea';
import Market from './components/Market/Market';

// CSS
import './App.css';



export const ScoreStateContext = createContext(undefined);
export const UpgradesStateContext = createContext(undefined);



export default function App() {
  const [score, setScore] = useState(0);

  const [upgrades, setUpgrades] = useState([
    {
      categoryName: "Clickers",
      upgradeList: [
        new Upgrade("Click Value", 5, 2),
      ]
    },

    {
      categoryName: "Markets",
      upgradeList: [
        new Upgrade("Price History Lifespan", 10, 1.2, 20),
        new Upgrade("Access Ticket Market (easy)", 20, 1, 1),
        new Upgrade("Access TixCoin Market (medium)", 500, 1, 1),
        new Upgrade("Access Golden-T Market (hard)", 2000, 1, 1),
      ]
    },
  ]);

  
  return (
    <div className="App">
      <p className="score">$core: {score}</p>

      <ScoreStateContext.Provider value={{score, setScore}}>
        <UpgradesStateContext.Provider value={{upgrades, setUpgrades}}>
          <UpgradesMenu />
          <ClickArea />
          {upgrades[1].upgradeList[1].getIsMaxed() ? <Market priceStart={50} priceMinimum={1} priceMaximum={100} priceInfluence={5} /> : ""}
          {upgrades[1].upgradeList[2].getIsMaxed() ? <Market name="TixCoin" priceStart={750} priceMinimum={500} priceMaximum={1000} priceInfluence={50} /> : ""}
          {upgrades[1].upgradeList[3].getIsMaxed() ? <Market name="Golden-T" priceStart={5000} priceMinimum={2000} priceMaximum={10000} priceInfluence={100} /> : ""}
        </UpgradesStateContext.Provider>
      </ScoreStateContext.Provider>

      <footer>
        <p className="copyrights">&#169; Joey Ducharme - 2024</p>
      </footer>
    </div>
  )
}





