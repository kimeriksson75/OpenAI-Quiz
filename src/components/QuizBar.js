import React, { useState, useEffect } from 'react';

const QuizBar = ({ socket, quiz }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
			socket.on('newUserResponse', (data) => setUsers(data));
			
		}, [socket, users]);
	
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