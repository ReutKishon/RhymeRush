import { ObjectId } from "mongoose";

export interface Game {
  gameCode: string;
  topic: String;
  maxPlayers: number;
  players: Player[];
  isStarted: boolean;
  currentTurn: number; // index of the player whose turn it is
  turnTimer: number; // time in seconds for each turn
  sentenceLengthAllowed: number; // number of words allowed for each turn
  song: Sentence[];
  winner: Player;
}

export interface Player {
  id: string;
}

export interface Sentence {
  content: string;
  player: Player;
  timestamp: Date;
}

interface User {
  _id: ObjectId;
  username: string;
  score: number;
  email: string;
  password: string;
  passwordConfirm: string;
}

type UserInput = Omit<User, "_id">;

export interface UserCreation extends Document, UserInput {}
export interface UserDocument extends User, Document {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
