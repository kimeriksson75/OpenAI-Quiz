/* eslint-disable no-undef */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";
import { SocketContext } from "../context/socket";
import QuizQuestionBar from "./QuizQuestionBar";
import Modal from "./Modal";
function Quiz(props) {
  const { quiz = [], onQuizFinished, room } = props;
  const socket = useContext(SocketContext);
  const QUIZ_ANSWER_TIME = 100;
  const [answers, setAnswers] = useState([]);
  const [roomAnswers, setRoomAnswers] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const userAnswer = useRef(null);
  const [time, setTime] = useState(QUIZ_ANSWER_TIME);
  const timeoutRef = useRef();
  const round = useRef(1);

  const handleAnswer = useCallback(
    async (answer) => {
      console.log("userAnswer.current", userAnswer.current);
      if (userAnswer.current) {
        return;
      }
      const answerTime = time;
      userAnswer.current = { answer, time: answerTime };
      setAnswers([...answers, { answer, time: answerTime }]);
      console.log("answers", answers);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // userAnswer.current = null;
      socket.emit("answer", {
        answer: userAnswer.current,
        name: localStorage.getItem("userName"),
        color: localStorage.getItem("color"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        role: "user",
        type: "quiz-answer",
        room,
        time: answerTime,
      });

      if (round.current < quiz.length - 1) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 5000));

      setFinished(true);
    },
    [userAnswer, answers, setAnswers, time]
  );

  const forceFinish = () => {
    console.log("forceFinish userAnswer", userAnswer);
    handleAnswer("-");
  };

  const initQuizTimer = useCallback(() => {
    timeoutRef.current = setInterval(() => {
      setTime((time) => {
        if (time < 1) {
          if (!timeoutRef.current) {
            return 0;
          }
          clearInterval(timeoutRef.current);
          timeoutRef.current = null;
          forceFinish();
          return 0;
        }
        return time - 1;
      });
    }, 100);
  }, [setTime, forceFinish]);

  useEffect(() => {
    socket.on("quizRound", (quizRound) => {
      if (quizRound === round.current) {
        return;
      }
      console.log("quizRound", quizRound);
      console.log("round.current", round.current);
      round.current = quizRound;
      setStarted(true);
      setTime(QUIZ_ANSWER_TIME);
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
        timeoutRef.current = null;
      }
      userAnswer.current = null;
      initQuizTimer();
      setRoomAnswers([]);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("answerResponse", (data) => {
      setRoomAnswers([...roomAnswers, data]);
      console.log("roomAnswers", roomAnswers);
    });
  }, [socket, roomAnswers]);

  useEffect(() => {
    if (finished) {
      const quizResult = answers.reduce(
        (acc, curr, i, arr) => {
          if (curr.answer === quiz[i].correctAnswer) {
            acc.correctAnswers += 1;
          }
          acc.averageUserResponseTime +=
            (QUIZ_ANSWER_TIME - curr.time) / arr.length / 10;

          return acc;
        },
        { correctAnswers: 0, averageUserResponseTime: 0 }
      );

      onQuizFinished(quizResult);
      round.current = 1;
      setAnswers([]);
    }
    return () => {
      setFinished(false);
    };
  }, [finished, answers]);

  const renderClassName = useCallback(
    (answer) => {
      if (userAnswer.current === null) {
        return "";
      }
      if (
        (answer === userAnswer.current.answer) ===
        quiz[round.current].correctAnswer
      ) {
        return "button-disabled button-correct";
      }
      if (
        answer === userAnswer.current.answer &&
        userAnswer.current.answer !== quiz[round.current].correctAnswer
      ) {
        return "button-disabled button-wrong";
      }

      if (answer === quiz[round.current].correctAnswer) {
        return "button-disabled button-correct";
      }
      return "button-disabled";
    },
    [userAnswer.current]
  );

  if (quiz.length === 0) {
    return null;
  }
  return (
    <Modal showModal={true}>
      <div className="quiz-component">
        <h1>Quiz</h1>
        <h4>{`${quiz[0]?.category}`}</h4>
        {!started ? (
          <p>Väntar på att quizet ska starta</p>
        ) : (
          <>
            <p>{`runda ${round.current + 1}/${quiz.length}`}</p>
            <div className="divider" />
            <p>{quiz[round.current].question}</p>
            <ul>
              {quiz[round.current].answers.map((answer, i) => (
                <li key={`key${i}`}>
                  <button
                    disabled={userAnswer.current}
                    className={`${renderClassName(answer)}`}
                    id={`answer-${i}`}
                    onClick={() => handleAnswer(answer)}
                  >
                    {answer}
                  </button>
                </li>
              ))}
            </ul>
            <QuizQuestionBar
              time={time}
              answerTime={QUIZ_ANSWER_TIME}
              round={round.current}
              roomAnswers={roomAnswers}
            />
          </>
        )}
      </div>
    </Modal>
  );
}
Quiz.propTypes = {
  room: PropTypes.string,
  quiz: PropTypes.array.isRequired,
  onQuizFinished: PropTypes.func,
};
export default Quiz;
