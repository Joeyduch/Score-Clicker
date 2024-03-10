
import { useState, createContext} from 'react'
import ClickArea from './components/ClickArea/ClickArea';
import Market from './components/Market/Market';
import './App.css'


export const ScoreStateContext = createContext(undefined);



function App() {
  
  const [score, setScore] = useState(500);

  
  return (
    <div className="App">
      <p className="score">Score: {score}</p>

      <ScoreStateContext.Provider value={{score, setScore}}>
        <ClickArea />
        <Market /> {/* ADD PROPS FOR WHAT CURRENCY EACH MARKET IS */}
      </ScoreStateContext.Provider>
      
    </div>
  )
}



export default App
