import React from "react";
// import userAvatar from "../../assets/images/user_profile.jpg";
interface PlayerProps {
  username: string;
  playerColor: string;
}

const PlayerAvatar: React.FC<PlayerProps> = ({ username, playerColor }) => {
  return (
    <div className="relative flex flex-col items-center w-34 h-34">
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: playerColor,
          borderColor: "rgba(0, 0, 0, 0.2)", // Semi-transparent border (faded)
        }}
      >
        {/* <span className="text-white font-bold">{username[0]}</span> Display the first letter of the username */}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-black text-xl font-bold">
        {username}
      </div>
    </div>
  );
};

export default PlayerAvatar;
