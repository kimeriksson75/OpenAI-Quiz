import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

function QuizQuestionBar({ time, answerTime, roomAnswers }) {
  const [barWidth, setBarWidth] = useState(100);
  const BAR_HEIGHT = 16;
  useEffect(() => {
    setBarWidth((time / answerTime) * 100);
  }, [time, answerTime, setBarWidth]);

  return (
    <div
      className="quiz-question-bar-container"
      style={{ height: `${24 + roomAnswers?.length * BAR_HEIGHT}px` }}
    >
      <div
        className={`${
          barWidth === 100 ? "quiz-question-bar-invisible" : "quiz-question-bar"
        }`}
        style={{ width: `${barWidth}%` }}
      />
      {roomAnswers?.map(({ name, color, time: userTime }, i) => (
        <div
          key={name}
          className="quiz-question-bar-user"
          style={{
            borderLeft: `2px solid #${color}`,
            borderBottom: `2px solid #${color}`,
            left: `${(userTime / answerTime) * answerTime}%`,
            width: `${answerTime - userTime}%`,
            height: `${(i + 1) * BAR_HEIGHT}px`,
          }}
        >
          <p
            style={{
              color: `#${color}`,
              marginTop: `${(i + 1) * BAR_HEIGHT}px`,
            }}
          >
            {`${name} - ${(answerTime - userTime) / 10}s`}
          </p>
        </div>
      ))}
    </div>
  );
}
QuizQuestionBar.propTypes = {
  time: PropTypes.number,
  answerTime: PropTypes.number,
  handleLeaveChat: PropTypes.func,
  roomAnswers: PropTypes.array,
};

export default QuizQuestionBar;
