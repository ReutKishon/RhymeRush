import axios from "axios";
import { Game, Player, Sentence } from "../../../shared/types/gameTypes";

const PATH = "http://localhost:3000/api/v1";

// export const getUser = async (id: string): Promise<Player> => {
//   try {
//     const response = await axios.get(PATH + "/users/getInfo/" + id);
//     if (response.status == 200) {
//       const userInfo = response.data[0];
//       // console.log(JSON.stringify(userInfo));
//       const user: Player = {
//         name: userInfo["name"],
//         email: userInfo["email"],
//         id: id,
//         imageUrl: "",
//       };
//       return user;
//     }
//   } catch (error) {
//     console.error("Error fetching user:", error);
//   }
// };

export const getGameData = async (gameCode: string): Promise<Game> => {
  try {
    const response = await axios.get(`${PATH}/game/${gameCode}`);
    const gameData: Game = response.data.data.gameData;
    return gameData;
  } catch (err) {
    throw err;
  }
};

export const getPlayers = async (gameCode: string): Promise<Player[]> => {
  try {
    return (await getGameData(gameCode)).players;
  } catch (err) {
    throw err;
  }
};

export const addPlayer = async (
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

export const getLyrics = async (gameCode: string): Promise<Sentence[]> => {
  try {
    return (await getGameData(gameCode)).lyrics;
  } catch (err) {
    throw err;
  }
};

export const getCurrentTurn = async (gameCode: string): Promise<Player> => {
  try {
    const gameData: Game = await getGameData(gameCode);
    return gameData.players[gameData.currentTurn];
  } catch (err) {
    throw err;
  }
};

export const addSentence = async (
  gameCode: string,
  sentence: string,
  playerId: string
) => {
  try {
    const response = await axios.post(
      `${PATH}/game/${gameCode}/${playerId}/sentence`,
      {
        sentence,
      }
    );
    return response.data.data;
  } catch (err) {
    throw err;
  }
};
