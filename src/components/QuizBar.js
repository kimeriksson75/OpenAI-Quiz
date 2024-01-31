import React, { useState, useEffect, useRef } from 'react';
import useAudio from '../hooks/useAudio';

const QuizBar = ({ socket }) => {
	const [users, setUsers] = useState([]);
	const newUserSoundFile = require("../assets/sounds/chat-new-user.mp3");

	const newUserSoundRef = useRef(null);
	const { audio: newUserSound } = useAudio(newUserSoundFile, newUserSoundRef);
    useEffect(() => {
			socket.on('newUserResponse', (data) => setUsers(data));
			if (newUserSound.current) {
				newUserSound.current.play();
			}
			
		}, [socket, users, newUserSound]);
	
	const renderUser = (user) => <li>
			<div className="user">
				<img
					alt='user avatar'
					className="user-image"
					src={`https://i.pravatar.cc/150?u=${user.socketID}`} />
				<span>{user.userName}</span>
			</div>
		</li> 
    return (
			<div className='quiz-bar'>
				<h1>Quiz</h1>
				<div className="users-list">
						<ul className='users'>
								{users.map(user => renderUser(user))}
						</ul>
				</div>
			</div>
    );
}

export default QuizBar;