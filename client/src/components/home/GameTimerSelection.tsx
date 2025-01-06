import { useState } from "react";

interface GameTimerSelectionProps{
  gameTimer: number;
  setGameTimer: (timer: number) => void;
}
const GameTimerSelection = ({gameTimer,setGameTimer}:GameTimerSelectionProps) => {
  return (
    <div className="mb-6">
      <label className="block text-lg mb-2">Select Game Timer</label>
      <div className="flex justify-around">
        <label className="flex items-center">
          <input
            type="radio"
            value={3}
            checked={gameTimer === 3}
            onChange={() => setGameTimer(3)}
            className="mr-2"
          />
          3 minutes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value={5}
            checked={gameTimer === 5}
            onChange={() => setGameTimer(5)}
            className="mr-2"
          />
          5 minutes
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            value={10}
            checked={gameTimer === 10}
            onChange={() => setGameTimer(10)}
            className="mr-2"
          />
          10 minutes
        </label>
      </div>
    </div>
  );
};

export default GameTimerSelection;
