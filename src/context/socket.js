/* eslint-disable no-undef */
import React from "react";
import socketIO from "socket.io-client";

const apiURL = process.env.REACT_APP_API_BASE_URL;
export const socket = socketIO.connect(apiURL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionDelay: 500,
  reconnectionAttempts: 10,
});
export const SocketContext = React.createContext();
