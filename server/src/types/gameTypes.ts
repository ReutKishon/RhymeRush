import { Socket } from "socket.io";
import { GameBase, Player } from "../../../shared/types/gameTypes";

// export interface Player extends PlayerBase {
//   socketId: string;
// }

export interface Game extends GameBase {
    currentTimerId: NodeJS.Timeout | null;
}

