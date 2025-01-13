import io from "socket.io-client";
const URL = process.env.APP_URL;

const socket = io(URL);


export default socket;
