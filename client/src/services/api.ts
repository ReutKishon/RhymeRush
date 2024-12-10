import axios from "axios";
import {
  GameBase as Game,
  PlayerBase as Player,
  User,
} from "../../../shared/types/gameTypes";

const PATH = process.env.REACT_APP_API_BASE_URL;

console.log(PATH);

export const createGame = async (gameCreatorId: string): Promise<string> => {
  try {
    const response = await axios.post(`http://localhost:3000/api/v1/game`, {
      gameCreatorId,
    });
    const gameCode = response.data.data.gameCode;
    console.log("Creating new game with code " + gameCode);

    return gameCode;
  } catch (err) {
    throw err;
  }
};

export const startGame = async (gameCode: string) => {
  try {
    await axios.patch(`http://localhost:3000/api/v1/game/${gameCode}/start`);
  } catch (err) {
    throw err;
  }
};

export const fetchGameData = async (gameCode: string): Promise<Game> => {
  try {
    const response = await axios.get(`${PATH}/game/${gameCode}`);
    const gameData: Game = response.data.data.gameData;
    return gameData;
  } catch (err) {
    throw err;
  }
};

export const joinPlayerToGame = async (
  gameCode: string,
  joinedPlayerId: string
): Promise<Player> => {
  try {
    const response = await axios.patch(
      `${PATH}/game/${gameCode}/${joinedPlayerId}`
    );
    return response.data.data.joinedPlayer;
  } catch (err) {
    throw err;
  }
};

export const removePlayer = async (
  gameCode: string,
  playerId: string
): Promise<void> => {
  try {
    await axios.delete(`${PATH}/game/${gameCode}/${playerId}`);
  } catch (err) {
    throw err;
  }
};

export const submitSentence = async (
  gameCode: string,
  playerId: string,
  sentence: string
): Promise<void> => {
  try {
    await axios.patch(`${PATH}/game/${gameCode}/${playerId}/sentence`, {
      sentence,
    });
  } catch (err) {
    throw err;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/login",
      {
        email: email,
        password: password,
      }
    );

    const token = response.data.token;
    localStorage.setItem("authToken", token);
    return response.data.data.userData;
  } catch (err) {
    throw err;
  }
};
