import { useTranslations } from "hooks/useTranslations";

interface GameTimerSelectorProps{
  gameTimer: number;
  setGameTimer: (timer: number) => void;
}
const GameTimerSelector = ({gameTimer, setGameTimer}: GameTimerSelectorProps) => {
  const t = useTranslations();
  const options = [
      // { value: 0.1, label: t.timer.min1 },
      { value: 3, label: t.timer.min3 },
      { value: 5, label: t.timer.min5 },
      { value: 10, label: t.timer.min10 },
  ];

  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <label className="">{t.game.howLongPlay}</label>
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
            [document.dir === 'rtl' ? 'right' : 'left']: `${((options.findIndex(opt => opt.value === gameTimer) * 100) / options.length ) + 1}%`,
            width: `${93 / options.length}%`
          }}
        />
      </div>
    </div>
  );
};

export default GameTimerSelector;
