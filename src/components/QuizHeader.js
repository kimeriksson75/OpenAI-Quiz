/* eslint-disable no-undef */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { CopyToClipboard } from "react-copy-to-clipboard";

function QuizHeader({ onInitQuiz, handleLeaveChat, room }) {
  const [copied, setCopied] = useState(false);
  const [value] = useState(`${window?.location?.origin}/${room}`);
  const onInvite = async () => {
    setCopied(true);
    await new Promise((resolve) =>
      setTimeout(() => {
        setCopied(false);
        resolve();
      }, 2000)
    );
  };

  const renderInviteText = () => {
    if (copied) {
      return "Dela";
    }
    return "Länk";
  };
  return (
    <header className="quiz-header">
      <div className="quiz-logo">
        <h1>Quiz</h1>
      </div>
      <nav className="quiz-header-content">
        {/* <p>{room.replace(/-/g, ' ' )}</p> */}
        <div className="button-group">
          <CopyToClipboard text={value} onCopy={() => onInvite()}>
            <button className="button-primary">{renderInviteText()}</button>
          </CopyToClipboard>
          <button className="button-primary" onClick={onInitQuiz}>
            Quizza
          </button>
          <button className="button-secondary" onClick={handleLeaveChat}>
            Hejdå!
          </button>
        </div>
      </nav>
    </header>
  );
}

QuizHeader.propTypes = {
  room: PropTypes.string,
  onInitQuiz: PropTypes.func,
  handleLeaveChat: PropTypes.func,
};
export default QuizHeader;
