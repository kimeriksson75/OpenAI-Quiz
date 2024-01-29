import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizHeader = ({ onInitQuiz }) => {
	const navigate = useNavigate();

	const handleLeaveChat = () => {
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };
	return (
		<header className='chat__mainHeader'>
			<button className='button-primary' onClick={onInitQuiz}>Börja quizza</button>
			<button className='button-secondary' onClick={handleLeaveChat}>Hoppa ut</button>
		</header>
	)
}

export default QuizHeader;