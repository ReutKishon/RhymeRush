import io from "socket.io-client";
const URL = process.env.REACT_APP_SOCKET_URL;

const socket = io(URL);

socket.on("connect", () => {
  console.log("Connected to the server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});

export default socket.connect();
