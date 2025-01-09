import { useState } from "react";

interface GameTimerSelectionProps{
  gameTimer: number;
  setGameTimer: (timer: number) => void;
}
const GameTimerSelection = ({gameTimer, setGameTimer}: GameTimerSelectionProps) => {
  const options = [
    { value: 3, label: '3 min' },
    { value: 5, label: '5 min' },
    { value: 10, label: '10 min' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <label className="block text-lg font-medium ">How long would you like to play?</label>
      <div className="relative p-1 bg-gray-100 rounded-full flex w-fit mx-auto ">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setGameTimer(option.value)}
            className={`
              relative z-10 px-6 py-2 rounded-full transition-all duration-300
              ${gameTimer === option.value 
                ? 'text-white' 
                : 'text-gray-600 hover:text-gray-800'
              }
            `}
          >
            {option.label}
          </button>
        ))}
        {/* Sliding background */}
        <div
          className="absolute inset-y-1 transition-all duration-300 bg-blue-500 rounded-full"
          style={{
            left:  `${((options.findIndex(opt => opt.value === gameTimer) * 100) / options.length ) + 1}%`,
            width: `${93 / options.length}%`
          }}
        />
      </div>
    </div>
  );
};

export default GameTimerSelection;
