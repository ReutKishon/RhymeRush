import { useState } from "react";

interface GameTimerSelectionProps{
  gameTimer: number;
  setGameTimer: (timer: number) => void;
}
const GameTimerSelection = ({gameTimer, setGameTimer}: GameTimerSelectionProps) => {
  const options = [
    { value: 0.1, label: '1 MIN' },
    { value: 3, label: '3 MIN' },
    { value: 5, label: '5 MIN' },
    { value: 10, label: '10 MIN' },
  ];

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <label className="">How long would you like to play?</label>
      <div className="w-full flex relative p-1  rounded-full bg-gray-100">
        {options.map((option) => (
          <button

            key={option.value}
            onClick={() => setGameTimer(option.value)}
            className={`
              relative z-10 bg-transparent
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
          className="absolute inset-y-1 transition-all duration-300 bg-primary-blue rounded-full"
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
