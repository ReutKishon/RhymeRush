const Topic = ({ topic }: { topic: string }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-6 w-[300px] h-[120px] animate-bounce-in">
      {/* Decorative Sparkles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[20px] h-[20px] bg-yellow-300 rounded-full blur-sm top-2 left-4 animate-ping"></div>
        <div className="absolute w-[20px] h-[20px] bg-pink-300 rounded-full blur-sm top-4 right-6 animate-ping"></div>
        <div className="absolute w-[20px] h-[20px] bg-blue-300 rounded-full blur-sm bottom-3 left-10 animate-ping"></div>
      </div>

      {/* Topic Header */}
      <div className="text-black text-2xl font-extrabold tracking-wider uppercase">
        ✨ Your Topic ✨
      </div>

      {/* Topic Content */}
      <div className="mt-3 px-4 py-2 bg-white text-pink-600 text-xl font-bold rounded-lg shadow-md border-2 border-green-200 animate-jump-in">
        {topic}
      </div>
    </div>
  );
};

export default Topic;
