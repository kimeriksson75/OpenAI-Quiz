/* eslint-disable no-undef */

import React, { useRef, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

import { useParams, useNavigate } from "react-router-dom";
import Quiz from "../components/Quiz";
import QuizBar from "../components/QuizBar";
import QuizHeader from "../components/QuizHeader";
import ChatFooter from "../components/ChatFooter";
import Chat from "../components/Chat";
import useAudio from "../hooks/useAudio";

const sendMessageSoundFile = require("../assets/sounds/chat-pop.mp3");
const receivedMessageSoundFile = require("../assets/sounds/chat-received-pop.mp3");
const newQuizSoundFile = require("../assets/sounds/new-quiz.mp3");

function QuizView(props) {
  const { socket } = props;
  const { room } = useParams();
  const [messages, setMessages] = useState([]);
  const [typingStatus] = useState("");
  const [isCategoryInput, setIsCategoryInput] = useState(false);
  const lastMessageRef = useRef(null);
  const [quizData, setQuizData] = useState([]);
  const latestResponse = useRef(false);
  const initiateQuiz = useRef(false);
  const isRejoining = useRef(false);
  const navigate = useNavigate();

  const sendMessageSoundRef = useRef(null);
  const receivedMessageSoundRef = useRef(null);
  const newQuizSoundRef = useRef(null);
  const { audio: sendMessageSound } = useAudio(
    sendMessageSoundFile,
    sendMessageSoundRef
  );
  const { audio: receiveMessageSound } = useAudio(
    receivedMessageSoundFile,
    receivedMessageSoundRef
  );
  const { audio: newQuizSound } = useAudio(newQuizSoundFile, newQuizSoundRef);

  useEffect(() => {
    if (!localStorage.getItem("socketID") && socket?.id) {
      localStorage.setItem("socketID", socket.id);
    }

    if (isRejoining.current) {
      return;
    }

    isRejoining.current = true;
    const socketID = localStorage.getItem("socketID");
    const name = localStorage.getItem("userName");
    const color = localStorage.getItem("color");
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    setMessages(messages);

    if (!name || !color) {
      navigate("/");
    }
    socket.emit("join", {
      name,
      color,
      socketID,
      room,
    });
  }, [socket]);

  const onInitQuiz = useCallback(() => {
    socket.emit("message", {
      text: `Så ni är redo att quizza? Vilken kategori vill du köra på ${localStorage.getItem(
        "userName"
      )}?`,
      name: "Quizmaestro",
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
      role: "admin",
      type: "initiateQuiz",
      room,
    });
    setIsCategoryInput(true);
  }, [setIsCategoryInput]);

  const handleLeaveChat = () => {
    socket.emit("message", {
      text: "Skjuter ut mig, hörs vi 🌴",
      name: localStorage.getItem("userName"),
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
      role: "user",
      type: "message",
      room,
    });
    socket.emit("leave", {
      name: localStorage.getItem("userName"),
      socketID: localStorage.getItem("socketID"),
      room,
    });
    localStorage.removeItem("socketID");
    localStorage.removeItem("userName");
    localStorage.removeItem("color");
    localStorage.removeItem("messages");
    navigate(`/${room}`);
    window.location.reload();
  };

  useEffect(() => {
    socket.on("newQuiz", (data) => {
      setQuizData(data.quiz);
      if (newQuizSound.current) {
        newQuizSound.current.play();
      }
    });
  }, [socket, newQuizSound]);

  const onQuizFinished = (result) => {
    console.log("onQuizFinished");
    setQuizData([]);
    initiateQuiz.current = false;

    socket.emit("quizFinished", {
      result: {
        ...result,
        category: quizData[0].category,
        maxPoints: quizData.length,
      },
      name: localStorage.getItem("userName"),
      id: `${socket.id}${Math.random()}`,
      socketID: socket.id,
      role: "user",
      type: "result",
      room,
    });
  };
  useEffect(() => {
    socket.on("messageResponse", (data) => {
      setMessages([...messages, data]);
      if (latestResponse.current === data) {
        return;
      }
      latestResponse.current = data;
      if (sendMessageSound.current && receiveMessageSound.current) {
        data.name === localStorage.getItem("userName")
          ? sendMessageSound.current.play()
          : receiveMessageSound.current.play();
      }

      return () => {
        socket.off("messageResponse");
      };
    });
  }, [socket, messages, sendMessageSound, receiveMessageSound]);

  return (
    <main className="quiz">
      <QuizHeader
        onInitQuiz={onInitQuiz}
        handleLeaveChat={handleLeaveChat}
        room={room}
      />

      {/* <Quiz socket={socket} /> */}
      {quizData.length > 0 ? (
        <Quiz
          onQuizFinished={onQuizFinished}
          socket={socket}
          quiz={quizData}
          room={room}
        />
      ) : null}
      <section className="quiz-main">
        <QuizBar socket={socket} room={room} />
        <div className="quiz-chat">
          <Chat messages={messages} lastMessageRef={lastMessageRef} />
          <ChatFooter
            typingStatus={typingStatus}
            socket={socket}
            room={room}
            isCategoryInput={isCategoryInput}
            setIsCategoryInput={setIsCategoryInput}
          />
        </div>
      </section>
    </main>
  );
}

QuizView.propTypes = {
  socket: PropTypes.shape({
    id: PropTypes.string,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired,
    connect: PropTypes.func.isRequired,
    emit: PropTypes.func.isRequired,
  }).isRequired,
};

export default QuizView;
