import React from "react";
import useRandomBackground from '../hooks/useRandomBackground';

const User = ({ user, id }) => {
	const { bgColor, pattern } = useRandomBackground();

	return (
			<div key={`user-${user.socketID}`} className={`user ${pattern}`} style={{backgroundColor: bgColor}}>
				<img
					alt='user avatar'
					className="user-image"
					src={`https://i.pravatar.cc/150?u=${user.socketID}`} />
				<div>
				<p>{user.name.slice(0, 5)}</p>
				</div>
			</div>
	)
}

export default User;