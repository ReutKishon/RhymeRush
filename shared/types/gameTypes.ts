import { ObjectId } from "mongoose";

interface User {
  _id: ObjectId;
  username: string;
  score: number;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface Player
  extends Omit<
    User,
    "_id" | "password" | "passwordConfirm" | "email" | "score"
  > {
  id: string;
  color: string;
}
export interface Game {
  gameCode: string;
  topic: String;
  maxPlayers: number;
  players: Player[];
  isStarted: boolean;
  currentTurn: number; // index of the player whose turn it is
  sentenceLengthAllowed: number; // number of words allowed for each turn
  lyrics: Sentence[];
  winner: Player;
}

export interface Sentence {
  content: string;
  player: Player;
  timestamp: Date;
}

type UserInput = Omit<User, "_id">;

export interface UserCreation extends Document, UserInput {}
export interface UserDocument extends User, Document {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
