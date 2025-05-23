import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Cog } from 'lucide-react';

// Types
type PieceType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
type CellType = PieceType | null;
type BoardType = CellType[][];
type ShapeType = number[][];
type KeyboardLayout = 'QWERTY' | 'AZERTY';

interface PieceInterface {
  shape: ShapeType;
  type: PieceType;
}

interface PositionInterface {
  x: number;
  y: number;
}

// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Minecraft block colors (fallback)
const COLORS: Record<string, string> = {
  I: 'bg-cyan-500', // Diamond
  J: 'bg-blue-700', // Lapis
  L: 'bg-orange-500', // copper
  O: 'bg-yellow-500', // Gold
  S: 'bg-green-500', // Emerald
  T: 'bg-purple-500', // Obsidian
  Z: 'bg-red-500', // Redstone
  empty: '', // Empty
};

// Minecraft textures with image paths
// Using placeholder images with distinctive colors that represent the Minecraft blocks
const TEXTURES: Record<PieceType, { name: string; path: string }> = {
  I: { name: 'diamond', path: '/public/minecraft-textures/diamond_block.png' },
  J: { name: 'lapis', path: '/public/minecraft-textures/lapis_block.png' },
  L: { name: 'copper', path: '/public/minecraft-textures/copper_block.png' },
  O: { name: 'gold', path: '/public/minecraft-textures/gold_block.png' },
  S: { name: 'emerald', path: '/public/minecraft-textures/emerald_block.png' },
  T: { name: 'obsidian', path: '/public/minecraft-textures/bookshelf.png' },
  Z: { name: 'redstone', path: '/public/minecraft-textures/tnt_side.png' },
};

// Piece shapes
const SHAPES: Record<PieceType, ShapeType> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

// Keyboard layouts
const KEYBOARD_CONTROLS = {
  QWERTY: {
    left: ['a', 'A'],
    right: ['d', 'D'],
    down: ['s', 'S'],
    rotate: ['w', 'W'],
    drop: [' '],
  },
  AZERTY: {
    left: ['q', 'Q'],
    right: ['d', 'D'],
    down: ['s', 'S'],
    rotate: ['z', 'Z'],
    drop: [' '],
  },
};

// Main component
const MinecraftTetris = () => {
  const [board, setBoard] = useState<BoardType>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<PieceInterface | null>(null);
  const [currentPosition, setCurrentPosition] = useState<PositionInterface>({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState<PieceInterface | null>(null);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(1);
  const [speed, setSpeed] = useState<number>(2000);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [linesCleared, setLinesCleared] = useState<number>(0);
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayout>('QWERTY');

  // Create an empty board
  function createEmptyBoard(): BoardType {
    return Array(BOARD_HEIGHT)
      .fill(null)
      .map(() => Array(BOARD_WIDTH).fill(null));
  }

  // Generate a new random piece
  const getRandomPiece = useCallback((): PieceInterface => {
    const pieces = Object.keys(SHAPES) as PieceType[];
    const randomType = pieces[Math.floor(Math.random() * pieces.length)];
    return {
      shape: SHAPES[randomType],
      type: randomType,
    };
  }, []);

  // Start the game
  const startGame = (): void => {
    setBoard(createEmptyBoard());
    const firstPiece = getRandomPiece();
    const secondPiece = getRandomPiece();
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setCurrentPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setShowGameOver(false);
    setGameStarted(true);
    setLevel(1);
    setSpeed(1000);
    setLinesCleared(0);
  };

  // Check if a position is valid
  const isValidPosition = useCallback(
    (piece: PieceInterface, position: PositionInterface): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardX = position.x + x;
            const boardY = position.y + y;

            // Check board boundaries
            if (
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              boardY >= BOARD_HEIGHT ||
              (boardY >= 0 && board[boardY][boardX] !== null)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [board]
  );

  // Check if a piece can be placed without overlapping existing pieces
  const canPlacePiece = useCallback(
    (piece: PieceInterface, position: PositionInterface): boolean => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          if (piece.shape[y][x]) {
            const boardX = position.x + x;
            const boardY = position.y + y;

            // Check if the piece is within the board and not overlapping
            if (
              boardX < 0 ||
              boardX >= BOARD_WIDTH ||
              boardY >= BOARD_HEIGHT ||
              (boardY >= 0 && board[boardY][boardX] !== null)
            ) {
              return false;
            }
          }
        }
      }
      return true;
    },
    [board]
  );

  // Rotate a piece
  const rotatePiece = useCallback((): void => {
    if (!currentPiece || gameOver) return;
    const newShape: ShapeType = [];
    for (let x = 0; x < currentPiece.shape[0].length; x++) {
      const row: number[] = [];
      for (let y = currentPiece.shape.length - 1; y >= 0; y--) {
        row.push(currentPiece.shape[y][x]);
      }
      newShape.push(row);
    }
    const rotatedPiece: PieceInterface = {
      ...currentPiece,
      shape: newShape,
    };
    if (isValidPosition(rotatedPiece, currentPosition)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, currentPosition, gameOver, isValidPosition]);

  // Clear completed lines
  const clearLines = useCallback(
    (board: BoardType): void => {
      let newLinesCleared = 0;
      for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every((cell) => cell !== null)) {
          newLinesCleared += 1;
          // Remove completed line
          for (let yy = y; yy > 0; yy--) {
            board[yy] = [...board[yy - 1]];
          }
          // Add new empty line at the top
          board[0] = Array(BOARD_WIDTH).fill(null);
          // Check the same line again
          y += 1;
        }
      }
      if (newLinesCleared > 0) {
        const totalLinesCleared = linesCleared + newLinesCleared;
        setLinesCleared(totalLinesCleared);
        const newScore = score + newLinesCleared * 100 * level;
        setScore(newScore);
        // Increase level every 10 lines
        const newLevel = Math.floor(totalLinesCleared / 10) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setSpeed(Math.max(100, 1000 - (newLevel - 1) * 100));
        }
      }
    },
    [score, level, linesCleared]
  );

  // Place a piece on the board
  const placePiece = useCallback((): void => {
    if (!currentPiece || !nextPiece) return;

    // Check if any part of the piece is above the board
    let hasVisiblePart = false;
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] && currentPosition.y + y >= 0) {
          hasVisiblePart = true;
          break;
        }
      }
      if (hasVisiblePart) break;
    }

    // If the piece is entirely above the board, it's game over
    if (!hasVisiblePart) {
      setGameOver(true);
      setShowGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    const newBoard: BoardType = JSON.parse(JSON.stringify(board));
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardX = currentPosition.x + x;
          const boardY = currentPosition.y + y;

          // Only place the piece if it's within the board
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece.type;
          } else if (boardY < 0) {
            // If part of the piece is above the board, it's game over
            setGameOver(true);
            setShowGameOver(true);
            if (score > highScore) {
              setHighScore(score);
            }
            return;
          }
        }
      }
    }

    setBoard(newBoard);
    clearLines(newBoard);

    // Use the next piece for current piece
    const newPiece = getRandomPiece();
    const newPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };

    // Check if the new piece can be placed
    if (!canPlacePiece(nextPiece, newPosition)) {
      setCurrentPiece(nextPiece);
      setNextPiece(newPiece);
      setCurrentPosition(newPosition);
      setGameOver(true);
      setShowGameOver(true);
      if (score > highScore) {
        setHighScore(score);
      }
    } else {
      setCurrentPiece(nextPiece);
      setNextPiece(newPiece);
      setCurrentPosition(newPosition);
    }
  }, [
    board,
    currentPiece,
    nextPiece,
    currentPosition,
    getRandomPiece,
    score,
    highScore,
    canPlacePiece,
    clearLines,
  ]);

  // Move a piece
  const movePiece = useCallback(
    (direction: 'left' | 'right' | 'down'): boolean => {
      if (!currentPiece || gameOver) return false;
      const newPosition: PositionInterface = { ...currentPosition };
      switch (direction) {
        case 'left':
          newPosition.x -= 1;
          break;
        case 'right':
          newPosition.x += 1;
          break;
        case 'down':
          newPosition.y += 1;
          break;
        default:
          return false;
      }
      if (isValidPosition(currentPiece, newPosition)) {
        setCurrentPosition(newPosition);
        return true;
      }
      // If we can't move down, place the piece
      if (direction === 'down') {
        placePiece();
        return false;
      }
      return false;
    },
    [currentPosition, currentPiece, gameOver, isValidPosition, placePiece]
  );

  // Hard drop - Fixed function
  const hardDrop = useCallback((): void => {
    if (!currentPiece || gameOver) return;

    let newPosition = { ...currentPosition };
    let canMoveDown = true;

    // Keep moving down until we hit something
    while (canMoveDown) {
      if (isValidPosition(currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
        newPosition = { ...newPosition, y: newPosition.y + 1 };
      } else {
        canMoveDown = false;
      }
    }

    // Update position
    setCurrentPosition(newPosition);
    // Place the piece immediately
    placePiece();
  }, [currentPosition, currentPiece, gameOver, isValidPosition, placePiece]);

  // Toggle keyboard layout
  const toggleKeyboardLayout = () => {
    setKeyboardLayout((prev) => (prev === 'QWERTY' ? 'AZERTY' : 'QWERTY'));
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!gameStarted || gameOver) return;

      const controls = KEYBOARD_CONTROLS[keyboardLayout];

      if (controls.left.includes(e.key)) {
        movePiece('left');
        e.preventDefault();
      } else if (controls.right.includes(e.key)) {
        movePiece('right');
        e.preventDefault();
      } else if (controls.down.includes(e.key)) {
        movePiece('down');
        e.preventDefault();
      } else if (controls.rotate.includes(e.key)) {
        rotatePiece();
        e.preventDefault();
      } else if (controls.drop.includes(e.key)) {
        hardDrop();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, gameOver, movePiece, rotatePiece, hardDrop, keyboardLayout]);

  // Main game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    const gameLoop = setInterval(() => {
      movePiece('down');
    }, speed);
    return () => {
      clearInterval(gameLoop);
    };
  }, [gameStarted, gameOver, movePiece, speed]);

  // Render the board
  const renderBoard = () => {
    const boardWithPiece: BoardType = JSON.parse(JSON.stringify(board));
    // Add current piece to the board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardX = currentPosition.x + x;
            const boardY = currentPosition.y + y;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              boardWithPiece[boardY][boardX] = currentPiece.type;
            }
          }
        }
      }
    }
    return (
      <div className='bg-brass_casing border-4 p-2'>
        <div className='relative inline-block'>
          {boardWithPiece.map((row, y) => (
            <div key={y} className='flex'>
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`h-8 w-8 ${
                    cell ? COLORS[cell] : COLORS.empty
                  } flex items-center justify-center`}
                >
                  {cell && (
                    <img
                      src={TEXTURES[cell].path}
                      alt={TEXTURES[cell].name}
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Display controls
  const renderControls = () => {
    const controls =
      keyboardLayout === 'QWERTY'
        ? { move: 'A/D', down: 'S', rotate: 'W' }
        : { move: 'Q/D', down: 'S', rotate: 'Z' };

    return (
      <div className='font-minecraft text-white'>
        <div className='flex gap-2'>
          <Cog />
          <p> Controls:</p>
        </div>
        <Button onClick={toggleKeyboardLayout} variant='outline' className='m-2 cursor-pointer'>
          {keyboardLayout === 'QWERTY' ? 'Switch to AZERTY' : 'Switch to QWERTY'}
        </Button>
        <ul className='list-disc pl-5'>
          <li>{controls.move}: Move left/right</li>
          <li>{controls.down}: Move down</li>
          <li>{controls.rotate}: Rotate</li>
        </ul>
      </div>
    );
  };

  // Game over screen
  const renderGameOverScreen = () => {
    if (!showGameOver) return null;
    return (
      <div className='bg-opacity-80 absolute inset-0 z-10 flex items-center justify-center bg-black'>
        <div className='bg-shadow_steel_casing w-5/6 rounded-lg p-8 text-center'>
          <h2 className='mb-4 text-4xl font-bold text-red-500'>Game Over!</h2>
          <div className='mb-6 space-y-3'>
            <p className='font-minecraft text-yellow-400'>
              Final Score: <span className='font-bold'>{score}</span>
            </p>
            <p className='font-minecraft text-green-400'>
              High Score: <span className='font-bold'>{Math.max(score, highScore)}</span>
            </p>
            <p className='font-minecraft text-blue-400'>
              Level Reached: <span className='font-bold'>{level}</span>
            </p>
            <p className='font-minecraft text-purple-400'>
              Lines Cleared: <span className='font-bold'>{linesCleared}</span>
            </p>
          </div>
          <Button onClick={startGame} className='font-minecraft w-full cursor-pointer'>
            New Game
          </Button>
        </div>
      </div>
    );
  };

  // Preview next piece
  const renderNextPiece = () => {
    if (!nextPiece) return null;
    return (
      <div className='mb-4 p-4'>
        <h3 className='font-minecraft text-center text-white'>Next Piece</h3>
        <div className='flex justify-center'>
          <div className={`grid grid-cols-${SHAPES[nextPiece.type][0].length}`}>
            {SHAPES[nextPiece.type].map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`next-${x}-${y}`}
                  className={`h-5 w-5 ${cell ? COLORS[nextPiece.type] : ''}`}
                >
                  {cell === 1 && (
                    <img
                      src={TEXTURES[nextPiece.type].path}
                      alt={TEXTURES[nextPiece.type].name}
                      className='h-full w-full object-cover'
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col items-center p-4'>
      <h1 className='font-minecraft mb-4 text-3xl font-bold'>Minecraft Tetris</h1>
      <div className='flex flex-col items-start gap-8 md:flex-row'>
        <div className='relative'>
          {renderBoard()}
          {renderGameOverScreen()}
        </div>
        <div className='flex flex-col items-center'>
          <div className='bg-brass_casing mb-4 w-full p-4'>
            {renderNextPiece()}
            <p className='font-minecraft mb-2 text-xl text-yellow-400'>Score: {score}</p>
            <p className='font-minecraft mb-2 text-xl text-green-400'>Level: {level}</p>
            <p className='font-minecraft mb-2 text-xl text-blue-400'>Lines: {linesCleared}</p>
            {gameOver && !showGameOver && (
              <div className='mb-4 text-xl font-bold text-red-500'>Game Over!</div>
            )}
            <Button
              onClick={startGame}
              variant='default'
              className='font-minecraft w-full cursor-pointer'
            >
              {gameStarted ? 'Restart' : 'Start'}
            </Button>
          </div>
          {renderControls()}
        </div>
      </div>
    </div>
  );
};

export default MinecraftTetris;
