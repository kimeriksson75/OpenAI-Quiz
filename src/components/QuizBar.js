import React, { useState, useEffect } from 'react';

const QuizBar = ({ socket, quiz }) => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
			socket.on('newUserResponse', (data) => setUsers(data));
			
		}, [socket, users]);
	
	const renderUser = (user) => <li>
			<div className="chat__user">
			<img
				alt='user avatar'
				className="chat__user-image"
				src={`https://i.pravatar.cc/150?u=${user.socketID}`} />
				<span>{user.userName}</span>
			</div>
		</li> 
    return (
			<div className='chat__sidebar'>
			<h2>Quiz time</h2>
			<div>
					<h4  className='chat__header'>Kompisar</h4>
					<ul className='chat__users'>
							{users.map(user => renderUser(user))}
					</ul>
			</div>
</div>
    );
}

export default QuizBar;