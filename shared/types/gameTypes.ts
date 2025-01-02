export interface User {
  username: string;
  score: number;
  songs: Sentence[][];
  email: string;
  password: string;
  id: string;
}

export interface Player {
  name: string;
  active: boolean;
  rank: number;
  color: string;
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
  players: Player[];
  currentTurnIndex: number;
  isActive: boolean;
  currentPlayerName: string;
  lyrics: Sentence[];
  winnerPlayerName: string;
  gameCreatorName: string;
  songId: string;
}

export interface Sentence {
  content: string;
  player: Player;
}

type UserInput = Omit<User, "_id">;

export interface UserCreation extends Document, UserInput {}
export interface UserDocument extends User, Document {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}
