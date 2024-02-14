/* eslint-disable no-undef */
import React, { useState, useEffect, useRef, useContext } from "react";
import { SocketContext } from "../context/socket";
import User from "./User";
import useAudio from "../hooks/useAudio";

function QuizBar() {
  const [users, setUsers] = useState([]);
  const socket = useContext(SocketContext);
  const newUserSoundFile = require("../assets/sounds/chat-new-user.mp3");
  const newUserSoundRef = useRef(null);
  const { audio: newUserSound } = useAudio(newUserSoundFile, newUserSoundRef);
  useEffect(() => {
    socket.on("newUserResponse", (data) => setUsers(data));
    if (newUserSound.current) {
      newUserSound.current.play();
    }
  }, [socket, users, newUserSound]);

  return (
    <aside className="quiz-bar">
      <div className="users">
        {users.map((user, i) => (
          <User key={`user-${i}`} user={user} id={i} />
        ))}
      </div>
    </aside>
  );
}

export default QuizBar;
