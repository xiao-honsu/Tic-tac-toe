import { useState } from 'react';

function Square({ value, onSquareClick, highlight }) {
  return (
    <button
      className={`square ${highlight ? 'highlight' : ''}`}
      onClick={onSquareClick}
      // also give a simple inline fallback highlight for users without CSS
      style={highlight ? { background: 'lightgreen' } : undefined}
    >
      {value}
    </button>
  );
}

/**
 * calculateWinner returns either:
 *  - { winner: 'X'|'O', line: [i, j, k] } when there is a winner
 *  - null when no winner
 */
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningLine = result ? result.line : [];
  const isDraw = !winner && squares.every(Boolean);

  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Build board dynamically with two nested loops (rows and columns)
  const boardRows = [];
  const size = 3;
  for (let row = 0; row < size; row++) {
    const rowSquares = [];
    for (let col = 0; col < size; col++) {
      const index = row * size + col;
      const highlight = winningLine.includes(index);
      rowSquares.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={() => handleClick(index)}
          highlight={highlight}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // build moves list with "You are at move #..." for currentMove
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      // try to find the changed square to optionally show coordinates (not required here)
      const prev = history[move - 1];
      let changedIndex = prev ? prev.findIndex((v, i) => v !== squares[i]) : -1;
      if (changedIndex >= 0) {
        const row = Math.floor(changedIndex / 3) + 1;
        const col = (changedIndex % 3) + 1;
        description = `Go to move #${move} (row ${row}, col ${col})`;
      } else {
        description = `Go to move #${move}`;
      }
    } else {
      description = 'Go to game start';
    }

    if (move === currentMove) {
      return (
        <li key={move}>
          <span style={{ fontWeight: 'bold' }}>You are at move #{move}</span>
        </li>
      );
    } else {
      return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <button
          onClick={() => setIsAscending(!isAscending)}
          style={{ marginBottom: '10px' }}
        >
          Sort {isAscending ? 'Descending' : 'Ascending'}
        </button>

        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}
