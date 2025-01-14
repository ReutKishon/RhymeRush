import React from "react";
import { Player } from "../../../../shared/types/gameTypes";

const PlayerAvatarMini = ({ name }: { name: string }) => {
  //Generate nickname from the player's name
  const getNickname = (name: string) => {
    const nameSplit = name.split(" ");
    if (nameSplit.length > 1) {
      return nameSplit.map((part) => part[0]?.toUpperCase() || "").join("");
    }

    return name[0] + name[1] + name[name.length - 1];
  };

  return (
    <div className="bg-primary-blue text-white flex items-center justify-center rounded-full w-[40px] h-[40px] text-sm font-bold">
      {getNickname(name)}
    </div>
  );
};

export default React.memo(PlayerAvatarMini);
