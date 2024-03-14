
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
        new Upgrade("Access Market 1", 20, 1, 1),
        new Upgrade("Access Market 2", 200, 1, 1),
        new Upgrade("Access Market 3", 2000, 1, 1),
      ]
    },
  ]);

  
  return (
    <div className="App">
      <p className="score">Score: {score}</p>

      <ScoreStateContext.Provider value={{score, setScore}}>
        <UpgradesStateContext.Provider value={{upgrades, setUpgrades}}>
          <UpgradesMenu />
          <ClickArea />
          {upgrades[1].upgradeList[1].getIsMaxed() ? <Market /> : ""}
          {upgrades[1].upgradeList[2].getIsMaxed() ? <Market /> : ""}
          {upgrades[1].upgradeList[3].getIsMaxed() ? <Market /> : ""}
        </UpgradesStateContext.Provider>
      </ScoreStateContext.Provider>

      <footer>
        <p className="copyrights">&#169; Joey Ducharme - 2024</p>
      </footer>
    </div>
  )
}





