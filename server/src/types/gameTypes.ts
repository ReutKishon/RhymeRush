import { Socket } from "socket.io";
import { GameBase, PlayerBase } from "../../../shared/types/gameTypes";

// export interface Player extends PlayerBase {
//   socketId: string;
// }

export interface Game extends GameBase {
  players: Record<string, PlayerBase>;
  // turnTimerId: NodeJS.Timeout | null;
}

