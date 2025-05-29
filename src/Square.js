import { useState, useContext, memo, useEffect } from "react";
import "./Square.css";
import { GameContext } from "./Game";

function Square({ id, hasBomb, bombsAround, handleSquareClick }) {
  const [clicked, setClicked] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const isGameOver = useContext(GameContext);

  useEffect(() => {
    if (clicked && !isGameOver) {
      handleSquareClick(id, hasBomb, bombsAround);
    }
  }, [clicked, id, hasBomb, bombsAround, handleSquareClick, isGameOver]);

  function handleClick(event) {
    if (clicked || isGameOver) return;
    if (flagged) {
      event.target = event.target.closest(".square");
      event.target.classList.remove("flagged");
      setFlagged(false);
    }
    event.target.classList.add("clicked");
    if (hasBomb) event.target.classList.add("bomb-clicked");
    setClicked(true);
  }

  const handleRightClick = (event) => {
    event.preventDefault();
    if (clicked || isGameOver) return;
    if(flagged)
      event.target = event.target.closest(".square");
    event.target.classList.toggle("flagged");
    setFlagged(!flagged);
  };

  const squareContentClasses = ["square-content"];
  if (hasBomb) squareContentClasses.push("has-bomb");

  let squareContent = bombsAround || "";
  if (hasBomb) squareContent = "💣";
  if (flagged) squareContent = "🚩";

  return (
    <div
      className="square"
      id={id}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      <span className={squareContentClasses.join(" ")}>
        {squareContent}
      </span>
    </div>
  );
}

export default memo(Square);
