/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import User from "./User";
import useAudio from "../hooks/useAudio";

function QuizBar({ socket }) {
  const [users, setUsers] = useState([]);
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

QuizBar.propTypes = {
  socket: PropTypes.shape({
    id: PropTypes.string,
    on: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
  }).isRequired,
};

export default QuizBar;
