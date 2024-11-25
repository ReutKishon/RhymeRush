import React from "react";
import userAvatar from "../../assets/images/user_profile.jpg";
interface PlayerProps {
  username: string;
}

const PlayerAvatar: React.FC<PlayerProps> = ({ username }) => {
  return (
    <div className="relative flex flex-col items-center w-34 h-34">
      <img
        src={userAvatar}
        alt={`${username}'s avatar`}
        className="w-20 h-20 rounded-full object-cover"       
      />
      <div className="absolute bottom-0 text-black px-2 py-1 text-xs font-bold rounded-t-lg">
        {username}
      </div>
    </div>
  );
};

export default PlayerAvatar;
