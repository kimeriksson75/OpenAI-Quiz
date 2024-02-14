export const message = ({
  socket,
  text,
  name,
  role = "admin",
  type = "message",
  room,
}) => {
  socket.emit("message", {
    text,
    name,
    id: `${socket.id}${Math.random()}`,
    socketID: socket.id,
    role,
    type,
    room,
  });
};

export const quizFinished = ({ socket, result, name, room }) => {
  socket.emit("quizFinished", {
    result,
    name,
    id: `${socket.id}${Math.random()}`,
    socketID: socket.id,
    role: "user",
    type: "result",
    room,
  });
};

export const onError = ({ socket, text, name, room }) => {
  socket.emit("message", {
    text,
    name,
    id: `${socket.id}${Math.random()}`,
    socketID: socket.id,
    role: "Quizmaestro",
    type: "error",
    room,
  });
};

export const leave = ({ socket, name, room }) => {
  socket.emit("leave", {
    name,
    socketID: socket.id,
    room,
  });
};

const socketBridge = {
  message,
  quizFinished,
  onError,
  leave,
};

export default socketBridge;
