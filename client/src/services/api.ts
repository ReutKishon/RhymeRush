import axios from "axios";
import {
  GameBase as Game,
  Player as Player,
  User,
} from "../../../shared/types/gameTypes";
import socket from "./socket";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Attach a request interceptor to add the token before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Get the token before every request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const createGame = async (
  gameCode: string,
  userName: string
): Promise<Game> => {
  try {
    console.log("Creating new game");
    const response = await api.post(`/game`, {
      uniqueCode: gameCode,
      userName,
    });
    const game: Game = response.data.data.game;
    socket.emit("gameCreated", game.code, userName);

    return game;
  } catch (err) {
    throw err;
  }
};

export const startGame = async (gameCode: string) => {
  try {
    await api.patch(`/game/${gameCode}/start`);
  } catch (err) {
    throw err;
  }
};

export const fetchGameData = async (gameCode: string): Promise<Game> => {
  try {
    const response = await api.get(`game/${gameCode}`);
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
    const response = await api.patch(`/game/${gameCode}/${joinedPlayerId}`);
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
    await api.delete(`/game/${gameCode}/${playerId}`);
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
    await api.patch(`/game/${gameCode}/${playerId}/sentence`, {
      sentence,
    });
  } catch (err) {
    throw err;
  }
};
export const saveSong = async (gameCode: string): Promise<void> => {
  await api.post(`/game/${gameCode}/save-song`);
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
