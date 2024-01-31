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
			<p>Surra på eller ta en quiz</p>
			<div className="button-group">
				<button className='button-primary' onClick={onInitQuiz}>Quizza</button>
				<button className='button-secondary' onClick={handleLeaveChat}>Hejdå!</button>
			</div>
		</header>
	)
}

export default QuizHeader;