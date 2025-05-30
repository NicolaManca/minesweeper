import { useState, createContext, useEffect, useRef } from "react";
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

function Timer({ startTimer, gameStatus }) {
  const [time, setTime] = useState(0);
  const timer = useRef(null);
  const ms = useRef(0);
  const ss = useRef(0);
  const mm = useRef(0);
  const hh = useRef(0);

  // eslint-disable-next-line no-extend-native
  Number.prototype.pad = function (n) {
    return (new Array(n).join("0") + this).slice((n || 2) * -1);
  };

  useEffect(() => {
    // Stop the timer if the game is over
    if (!startTimer || gameStatus === "won" || gameStatus === "lost") {
      if (timer.current) clearInterval(timer.current);
      return;
    }
    timer.current = setInterval(() => {
      const startTimerValue = new Date().getTime() - startTimer;
      setTime(startTimerValue);
      ms.current = startTimerValue % 1000;
      ss.current = Math.floor((startTimerValue / 1000) % 60);
      mm.current = Math.floor((startTimerValue / 60000) % 60);
      hh.current = Math.floor((startTimerValue / 3600000) % 24);
    }, 20);
    return () => clearInterval(timer.current);
  }, [gameStatus, startTimer]);

  return (
    <h2 className="game-timer">
      {hh.current.pad(2)}:{mm.current.pad(2)}:{ss.current.pad(2)}.
      {ms.current.pad(3)}
    </h2>
  );
}

const GameContext = createContext();

function Game() {
  const [result, setResult] = useState("");
  const [gameKey, setGameKey] = useState(uuidv4());
  const [difficulty, setDifficulty] = useState("");
  const [startTimer, setStartTimer] = useState(null);

  function handleSquareClickGame(gameStatus, hasGameStarted) {
    if (!hasGameStarted) setStartTimer(new Date().getTime()); // Start the timer on the first click
    if (gameStatus === "lose") {
      setResult("lost");
    } else if (gameStatus === "win") {
      setResult("won");
    }
  }

  const handleClickRestart = () => {
    setResult("");
    setStartTimer(null);
    setGameKey(uuidv4()); // Reset the game by generating a new key
  };

  const handleDifficultySelection = (size) => {
    setDifficulty(sizes[size]);
    setResult("");
    setGameKey(uuidv4()); // Reset the game by generating a new key
  };

  const handleClickMenu = () => {
    setResult("");
    setStartTimer(null);
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
       {difficulty && <Timer key={gameKey} startTimer={startTimer} gameStatus={result} />}
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
