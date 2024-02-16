import React from "react";
import PropTypes from "prop-types";

const QuizInfoBar = ({ room }) => {
  if (!room) {
    return null;
  }
  return (
    <div className="quiz-infobar">
      <h4>{room.replace(/-/g, " ")}</h4>
    </div>
  );
};

QuizInfoBar.propTypes = {
  room: PropTypes.string.isRequired,
};
export default QuizInfoBar;
