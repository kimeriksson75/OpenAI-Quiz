/* eslint-disable no-undef */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import { SocketContext } from "../context/socket";
import { useParams, useNavigate } from "react-router-dom";
import Quiz from "../components/Quiz";
import QuizBar from "../components/QuizBar";
import QuizHeader from "../components/QuizHeader";
import ChatFooter from "../components/ChatFooter";
import Chat from "../components/Chat";
import useAudio from "../hooks/useAudio";
import quizSchema from "../utils/validation/quiz-schema";
import { message, quizFinished, onError, leave } from "../utils/socketBridge";

const sendMessageSoundFile = require("../assets/sounds/chat-pop.mp3");
const receivedMessageSoundFile = require("../assets/sounds/chat-received-pop.mp3");
const newQuizSoundFile = require("../assets/sounds/new-quiz.mp3");

function QuizView() {
  const socket = useContext(SocketContext);
  const { room } = useParams();
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
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
    const socketID = localStorage.getItem("socketID") || null;
    const name = localStorage.getItem("userName") || "";
    const color = localStorage.getItem("color") || "";
    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    console.log("name", name);
    console.log("color", color);
    console.log("messages", messages);
    setMessages(messages);

    if (!name || !color || !socketID) {
      return;
    }
    socket.emit("join", {
      name,
      color,
      socketID,
      room,
    });
  }, [socket]);

  const onInitQuiz = useCallback(() => {
    message({
      socket,
      text: `Så ni är redo att quizza? Vilken kategori vill du köra på ${localStorage.getItem(
        "userName"
      )}?`,
      name: "Quizmaestro",
      role: "admin",
      type: "initiateQuiz",
      room,
    });
    setIsCategoryInput(true);
  }, [setIsCategoryInput]);

  const handleLeaveChat = () => {
    message({
      socket,
      text: "Skjuter ut mig, hörs vi 🌴",
      name: localStorage.getItem("userName"),
      role: "user",
      type: "message",
      room,
    });
    message({
      socket,
      text: "Skjuter ut mig, hörs vi 🌴",
      name: localStorage.getItem("userName"),
      room,
    });
    leave({
      socket,
      name: localStorage.getItem("userName"),
      room,
    });

    localStorage.removeItem("socketID");
    localStorage.removeItem("userName");
    localStorage.removeItem("color");
    localStorage.removeItem("messages");
    navigate(`/${room}`);
    window.location.reload();
  };

  const validateQuiz = (quiz) => {
    const { error } = quizSchema.validate(quiz);
    if (error) {
      console.error(error);
      return false;
    }
    return true;
  };

  useEffect(() => {
    socket.on("newQuiz", (data) => {
      if (!validateQuiz(data.quiz)) {
        onError({
          socket,
          text: "🔥 Ojoj, något gick fel med quizzet. Försök igen!",
          name: "Quizmaestro",
          room,
        });
        return;
      }
      setQuizData(data.quiz);
      if (newQuizSound.current) {
        newQuizSound.current.play();
      }
    });
  }, [socket, newQuizSound]);

  const onQuizFinished = (result) => {
    setQuizData([]);
    initiateQuiz.current = false;
    const extendedResult = {
      ...result,
      category: quizData[0].category,
      maxPoints: quizData.length,
    };
    quizFinished({
      socket,
      result: extendedResult,
      name: localStorage.getItem("userName"),
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

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    socket.on("typingResponse", (data) => {
      if (data) {
        setTypingStatus(data);
      } else {
        setTypingStatus("");
      }
    });
  }, [socket]);
  return (
    <div className="quiz">
      <QuizHeader
        onInitQuiz={onInitQuiz}
        handleLeaveChat={handleLeaveChat}
        room={room}
      />

      {/* <Quiz socket={socket} /> */}
      {quizData.length > 0 ? (
        <Quiz onQuizFinished={onQuizFinished} quiz={quizData} room={room} />
      ) : null}
      <main className="quiz-main">
        <QuizBar room={room} />
        <div className="quiz-chat">
          <Chat messages={messages} lastMessageRef={lastMessageRef} />
          <ChatFooter
            typingStatus={typingStatus}
            room={room}
            isCategoryInput={isCategoryInput}
            setIsCategoryInput={setIsCategoryInput}
          />
        </div>
      </main>
    </div>
  );
}

export default QuizView;
