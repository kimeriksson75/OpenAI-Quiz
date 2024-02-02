import React, { useState, useEffect, useRef } from 'react';
import User from './User';
import useAudio from '../hooks/useAudio';
const QuizBar = ({ socket, room }) => {
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
	
	
    return (
			<div className='quiz-bar'>
				<h1>Quiz</h1>
				<div className="users-list">
						<ul className='users'>
								{users.map((user, i) => <User user={user} id={i} />)}
						</ul>
				</div>
			</div>
    );
}

export default QuizBar;