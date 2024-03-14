
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
      categoryName: "Clicker",
      upgradeList: [
        new Upgrade("Click Value", 5, 2),
      ]
    },

    {
      categoryName: "Markets",
      upgradeList: [
        new Upgrade("Accessible Market Amount", 20, 10, 3),
        new Upgrade("Price History Lifespan", 5, 2, 20),
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
          {}
          <Market /> {/* ADD PROPS FOR WHAT CURRENCY EACH MARKET IS */}
        </UpgradesStateContext.Provider>
      </ScoreStateContext.Provider>
      
      <h1>*** FIX MARKET AMOUNT UPGRADE ***</h1>
      <footer>
        <p className="copyrights">&#169; Joey Ducharme - 2024</p>
      </footer>
    </div>
  )
}





