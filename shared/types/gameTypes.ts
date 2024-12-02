import { ObjectId } from "mongoose";

export interface User {
  username: string;
  score: number;
  email: string;
  password: string;
  id : string;

}


export interface Player{
  id: string;
  name: string;
}
export interface Game {
  code: string;
  topic: string;
  players: Player[];
  isActive: boolean;
  currentPlayerId: string; 
  lyrics: Sentence[];
  winnerPlayerId: string;
  gameCreatorId: string; // id of the player who created the game
}

export interface Sentence {
  content: string;
  player: string;
}

type UserInput = Omit<User, "_id">;

export interface UserCreation extends Document, UserInput {}
export interface UserDocument extends User, Document {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
