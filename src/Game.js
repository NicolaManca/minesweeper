import { useState, createContext } from "react";
import { v4 as uuidv4 } from "uuid";
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
  const [result, setResult] = useState("");
  const [gameKey, setGameKey] = useState(uuidv4());
  const [difficulty, setDifficulty] = useState("");

  function handleSquareClickGame(gameStatus) {
    if (gameStatus === "lose") {
      setResult("lost");
      console.log("GAME OVER - You clicked on a bomb!");
    } else if (gameStatus === "win") {
      setResult("won");
      console.log("You won!");
    }
  }

  const handleClickRestart = () => {
    setResult("");
    setGameKey(uuidv4()); // Reset the game by generating a new key
  };

  const handleDifficultySelection = (size) => {
    setDifficulty(sizes[size]);
    setResult("");
    setGameKey(uuidv4()); // Reset the game by generating a new key
  };

  const handleClickMenu = () => {
    setDifficulty("");
  };

  const difficulties = Object.keys(sizes).map((size) => {
    return (
      <button key={size} onClick={() => handleDifficultySelection(size)}>
        {size.slice(0, 1).toUpperCase() + size.slice(1)}
      </button>
    );
  });

  return (
    <GameContext.Provider value={result}>
      <div className="game-header">
        <h1 className="game-title">Minesweeper</h1>
        {difficulty && (
          <div className="game-header-buttons">
            <button className="game-header-button" onClick={handleClickMenu}>
              Menu
            </button>
            <button className="game-header-button" onClick={handleClickRestart}>
              Restart
            </button>
          </div>
        )}
        <h2 className="game-timer">Timer: TODO</h2>
      </div>
      {!difficulty && (
        <div className="game-difficulty">
          <h2>Select Difficulty:</h2>
          <div className="game-difficulty-buttons">{difficulties}</div>
        </div>
      )}
      {difficulty && (
        <Board
          key={gameKey}
          size={difficulty}
          handleSquareClick={handleSquareClickGame}
        />
      )}

      {result && (
        <div className="game-difficulty">
          <h2>{`You ${result}!`}</h2>
        </div>
      )}
    </GameContext.Provider>
  );
}
export { GameContext };
export default Game;
