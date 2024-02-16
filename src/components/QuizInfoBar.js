import React from "react";
import PropTypes from "prop-types";

const QuizInfoBar = ({ room }) => {
  if (!room) {
    return null;
  }
  return (
    <div className="quiz-infobar">
      <h4>
        Rum <span>{room.replace(/-/g, " ")}</span>
      </h4>
    </div>
  );
};

QuizInfoBar.propTypes = {
  room: PropTypes.string.isRequired,
};
export default QuizInfoBar;
