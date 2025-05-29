import { memo, useRef, useState } from "react";
import "./Board.css";
import Square from "./Square";

function _assignBombsToSquares(bombNumber, squarePerRow) {
  //Generate a random number between 1 and bombNumber
  const bombs = [];
  for (let i = 0; i < bombNumber; i++) {
    //Generate a random row and column
    let bomb = {
      row: Math.floor(Math.random() * squarePerRow),
      col: Math.floor(Math.random() * squarePerRow),
    };
    //Check if the bomb is already assigned
    if (!bombs.some((b) => b.row === bomb.row && b.col === bomb.col)) {
      bombs.push(bomb);
    } else {
      i--; // If the bomb is already assigned, decrement i to try again
    }
  }
  return bombs;
}

function _calculateBombsAroundSquare(row, col, bombs, squarePerRow) {
  let bombsNumber = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the square itself
      let newRow = row + i;
      let newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < squarePerRow &&
        newCol >= 0 &&
        newCol < squarePerRow
      ) {
        if (bombs.some((bomb) => bomb.row === newRow && bomb.col === newCol)) {
          bombsNumber++;
        }
      }
    }
  }
  return bombsNumber;
}

function _showAdjacentSquares(squareId, squarePerRow) {
  const row = Math.floor(squareId / squarePerRow);
  const col = squareId % squarePerRow;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Skip the square itself
      const newRow = row + i;
      const newCol = col + j;
      if (
        newRow >= 0 &&
        newRow < squarePerRow &&
        newCol >= 0 &&
        newCol < squarePerRow
      ) {
        const adjacentSquareId = newCol + newRow * squarePerRow;
        const squareElement = document.getElementById(adjacentSquareId);
        if (squareElement) {
          //squareElement.classList.add("clicked");
          squareElement.click();
        }
      }
    }
  }
}

function _showBombs(bombs, squarePerRow) {
  bombs.forEach((bomb) => {
    const squareId = bomb.col + bomb.row * squarePerRow;
    const squareElement = document.getElementById(squareId);
    if (squareElement) {
      squareElement.classList.add("clicked");
    }
  });
}

function Board({ size, handleSquareClick }) {
  const [board, setBoard] = useState([]);
  const squaresClicked = useRef(0);

  const squarePerRow = Math.sqrt(size);
  if (board.length === 0) {
    console.log("GENERATING BOARD");
    const bombNumber = size / 5; // 20% of the squares will have bombs
    const bombs = _assignBombsToSquares(bombNumber, squarePerRow);
    let boardT = [],
      squareId,
      hasBomb,
      bombsAround;
    for (let row = 0; row < squarePerRow; row++) {
      boardT[row] = [];
      for (let col = 0; col < squarePerRow; col++) {
        squareId = col + row * squarePerRow;
        hasBomb = bombs.some((bomb) => bomb.row === row && bomb.col === col);
        if (!hasBomb)
          bombsAround = _calculateBombsAroundSquare(
            row,
            col,
            bombs,
            squarePerRow
          );
        boardT[row][col] = (
          <Square
            key={squareId}
            id={squareId}
            hasBomb={hasBomb}
            bombsAround={bombsAround}
            handleSquareClick={handleSquareClickBoard}
          ></Square>
        );
      }
    }
    setBoard(boardT);

    function handleSquareClickBoard(squareId, hasBomb, bombsAround) {
      squaresClicked.current = squaresClicked.current + 1;
      let gameStatus = null;
      if (hasBomb) {
        _showBombs(bombs, squarePerRow);
        gameStatus = "lose";
      } else if (squaresClicked.current === size - squarePerRow) {
        _showBombs(bombs, squarePerRow);
        gameStatus = "win";
      } else if (bombsAround === 0) {
        //Show all squares around
        _showAdjacentSquares(squareId, squarePerRow);
      }
      handleSquareClick(gameStatus);
    }
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((square) => square)}
        </div>
      ))}
    </div>
  );
}

export default memo(Board);
