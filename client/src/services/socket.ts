import io from "socket.io-client";
const URL = process.env.REACT_APP_URL;

const socket = io(URL);

export default socket;
