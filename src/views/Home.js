/* eslint-disable no-undef */
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useParams } from "react-router-dom";

function Home({ socket }) {
  const { room = null } = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [errors] = useState({});
  const [generateRoomName, setGenerateRoomName] = useState(room || null);
  const isFetching = useRef(false);

  const colors = [
    "C73E1D", // Red
    "522A27", // Red dark
    "2E5339", // Green
    "E77728", // Orange
    "684E32", // Brown
    "034732", // Green dark
    "0C1821", // Blue dark
    "61304B", // Purple
    "585123", // Olive
    "FFBA08", // Yellow
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    const { userName } = inputs;
    const color = colors[Math.floor(Math.random() * colors.length)];
    localStorage.setItem("userName", userName);
    localStorage.setItem("color", color);

    socket.connect({
      query: {
        name: userName,
        socketID: socket.id,
        room: generateRoomName,
      },
    });
    socket.emit("join", {
      name: userName,
      color,
      socketID: socket.id,
      room: generateRoomName,
    });
    navigate(`/quiz/${generateRoomName}`);
  };

  const onHandleChange = async (event) => {
    const { name } = event.target;
    const { value } = event.target;
    await setInputs((values) => ({ ...values, [name]: value }));
  };

  useEffect(() => {
    if (!generateRoomName && !isFetching.current) {
      isFetching.current = true;
      socket.emit("generateRandomName", null);

      socket.on("generateRandomNameResponse", (data) => {
        isFetching.current = false;
        setGenerateRoomName(data.randomName);
      });
    }
  }, [socket, generateRoomName, setGenerateRoomName, isFetching]);

  return (
    <div className="home">
      <header className="home-header" />
      <div className="home-login-form">
        <h1 className="">Hej,</h1>
        {generateRoomName ? (
          <div>
            <p className="">du kommer ansluta till rum</p>
            <h4>{generateRoomName}.</h4>
            <div className="divider" />
          </div>
        ) : (
          <p>Genererar ett rum för din quiz, hold on.</p>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="userName">ditt namn tack</label>
          <input
            placeholder="Ann-Sofie t ex"
            className={`input ${errors.userName ? "error" : ""}`}
            onChange={onHandleChange}
            name="userName"
            id="userName"
            data-testid="userName"
            label="Användarnamn:"
            value={inputs.userName || ""}
            type="text"
          />
          <div className="form error-message">
            {errors.userName ? errors.userName : null}
          </div>
          <button
            type="submit"
            disabled={!generateRoomName}
            className="button-submit"
          >
            Börja Quiz
          </button>
        </form>
      </div>
    </div>
  );
}

Home.propTypes = {
  socket: PropTypes.shape({
    id: PropTypes.string,
    on: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
  }).isRequired,
};
export default Home;
