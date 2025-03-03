import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 20;

const App = () => {
  const [snake, setSnake] = useState([[5, 5]]);
  const [food, setFood] = useState([10, 10]);
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0); // Add score state

  const restartGame = () => {
    setSnake([[5, 5]]); // Reset the snake's initial position
    setFood([10, 10]);  // Reset the food's position
    setDirection('RIGHT'); // Reset the initial direction
    setGameOver(false); // Clear the game over state
    setScore(0); // Reset the score
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const moveSnake = () => {
      if (gameOver) return;

      const newSnake = [...snake];
      const head = newSnake[newSnake.length - 1];

      let newHead;
      switch (direction) {
        case 'UP':
          newHead = [head[0] - 1, head[1]];
          break;
        case 'DOWN':
          newHead = [head[0] + 1, head[1]];
          break;
        case 'LEFT':
          newHead = [head[0], head[1] - 1];
          break;
        case 'RIGHT':
          newHead = [head[0], head[1] + 1];
          break;
        default:
          return;
      }

      // Check for collisions
      if (
        newHead[0] < 0 ||
        newHead[0] >= GRID_SIZE ||
        newHead[1] < 0 ||
        newHead[1] >= GRID_SIZE ||
        newSnake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
      ) {
        setGameOver(true);
        return;
      }

      newSnake.push(newHead);

      // Check if the snake eats the food
      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setFood([
          Math.floor(Math.random() * GRID_SIZE),
          Math.floor(Math.random() * GRID_SIZE),
        ]);
        setScore(score + 1); // Increment score
      } else {
        newSnake.shift();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, score]);

  return (
    <div>
      {gameOver ? (
        <div>
          <h1>Game Over</h1>
          <h2>Final Score: {score}</h2> {/* Display final score */}
          <button
            onClick={restartGame}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Restart Game
          </button>
        </div>
      ) : (
        <div>
          <h1>Snake Game</h1>
          <h2>Score: {score}</h2> {/* Display score */}
          <p>Use the arrow keys to control the snake!</p>
          <div
            className="board"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
              margin: '0 auto',
            }}
          >
            {[...Array(GRID_SIZE * GRID_SIZE)].map((_, index) => {
              const x = Math.floor(index / GRID_SIZE);
              const y = index % GRID_SIZE;
              const isSnake = snake.some(segment => segment[0] === x && segment[1] === y);
              const isFood = food[0] === x && food[1] === y;
              return (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'lightgray',
                    border: '1px solid white',
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
