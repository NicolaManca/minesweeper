import { useState, createContext } from "react";
import {v4 as uuidv4} from 'uuid';
import Board from "./Board";
import "./Game.css";

const sizes = {
  test: 16,
  small: 64,
  medium: 256,
  large: 512,
  massive: 1024,
};

const GameContext = createContext();

function Game() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(uuidv4());

  function handleSquareClickGame(gameStatus) {
    if(gameStatus === "lose"){
      setIsGameOver(true);
      console.log("GAME OVER - You clicked on a bomb!");
    }
    else if(gameStatus === "win"){
      setIsGameOver(true);
      console.log("You won!");
    }
  }

  const handleClickRestart = () => {
    setIsGameOver(false);
    setGameKey(uuidv4()); // Reset the game by generating a new key
    console.log("Game restarted");
  };

  return (
    
    <GameContext.Provider value={isGameOver}>
      <div className="game-header">
        <h1 className="game-title">Minesweeper</h1>
        <button className="game-restart-button" onClick={handleClickRestart}>Restart</button>
        <h2 className="game-timer">Timer: TODO</h2>
      </div>
      <Board key={gameKey} size={sizes.massive} handleSquareClick={handleSquareClickGame} />
    </GameContext.Provider>
  );
}
export { GameContext };
export default Game;
