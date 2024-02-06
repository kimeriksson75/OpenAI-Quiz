import React from 'react';

const Chat = ({ messages, lastMessageRef }) => {
    
	return (
			
		<div className="chat">
			{messages.map(message => (
				message.name === localStorage.getItem("userName") ? (
					<div className="message__chats" key={message.id}>
					<p className='sender__name'>Du:</p>
					<div className='message__sender'>
							<p>{message.text}</p>
					</div>
				</div>
			): (
				<div className="message__chats" key={message.id}>
							<p className="recipient__name">{message.name}:</p>
					<div className='message__recipient'>
							<p>{message.text}</p>
					</div>
			</div>
			)
			))}
			<div ref={lastMessageRef} />   
		</div>
  )

};

export default Chat;