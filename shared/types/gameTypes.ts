export interface User {
  username: string;
  score: number;
  songs: Sentence[][];
  email: string;
  password: string;
  id: string;
}

export interface PlayerBase {
  id: string;
  name: string;
  active: boolean;
}

export interface Song {
  _id: string;
  topic: string;
  lyrics: Sentence[];
  createdAt: Date;
}

export interface GameBase {
  code: string;
  topic: string;
  players: Record<string, PlayerBase>;
  turnOrder: string[]; // By their ids
  currentTurnIndex: number;
  isActive: boolean;
  currentPlayerId: string;
  lyrics: Sentence[];
  winnerPlayerId: string;
  gameCreatorId: string;
  songId: string;
}

export interface Sentence {
  content: string;
  playerId: string;
}

type UserInput = Omit<User, "_id">;

export interface UserCreation extends Document, UserInput {}
export interface UserDocument extends User, Document {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
