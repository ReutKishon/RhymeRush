import io from "socket.io-client";

const URL = "http://localhost:3000";

const socket = io(URL);

socket.on("connect", () => {
  console.log("Connected to the server with ID:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});

export default socket.connect();
