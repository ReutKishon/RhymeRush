import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// interface CreateGameModalProps {
//   //   isOpen: boolean;
//   //   onClose: () => void;
//   gameCode: string;
// }

const CreateGameModal: React.FC = ({}) => {
  const { playerId } = useParams<{ playerId: string }>();
  const [gameCode, setGameCode] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    console.log("REUT");
    const createGame = async () => {
      try {
        const response = await axios.post(`http://localhost:3000/api/v1/game`, {
          gameCreatorId: playerId,
        });
        console.log("response: ", response);

        setGameCode(response.data.data.gameData.gameCode);
      } catch (err) {
        console.log(err);
      }
    };
    createGame();
  }, [playerId]);

  const handleEnterGame = () => {
    if (!gameCode) {
      return;
    }
    navigate(`/game/${gameCode}`); // Navigate to the BoardGame page with gameCode
  };

  //   if (!isOpen) {
  //     const deleteGame = async () => {
  //       try {
  //         await axios.delete(`http://localhost:3000/api/v1/game/${gameCode}`);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     deleteGame();
  //     return null;
  //   }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Game Created!</h2>
        <p className="text-gray-700 mb-4">
          Share this game code with others to join:
        </p>
        <div className="mb-4">
          <input
            type="text"
            value={gameCode}
            readOnly
            className="w-full border border-gray-300 rounded px-4 py-2 bg-gray-100"
          />
        </div>
        <button
          onClick={handleEnterGame}
          className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600 w-full mb-2"
        >
          Enter Game
        </button>
      </div>
    </div>
  );
};

export default CreateGameModal;
