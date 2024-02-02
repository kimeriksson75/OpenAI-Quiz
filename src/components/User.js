import React from "react";
import useRandomBackground from '../hooks/useRandomBackground';

const User = ({ user, id}) => {
	const { bgColor, pattern } = useRandomBackground();

	return (
		<li key={`user-${id}`}>
			<div className={`user ${pattern}`} style={{backgroundColor: bgColor}}>
				<img
					alt='user avatar'
					className="user-image"
					src={`https://i.pravatar.cc/150?u=${user.socketID}`} />
				<span>{user.name}</span>
			</div>
		</li> 
	)
}

export default User;