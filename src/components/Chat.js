import React from 'react';

const Chat = ({ messages, lastMessageRef, typingStatus, onInitQuiz }) => {
    
  return (
    <div className='message__container'>
        {messages.map(message => (
        message.name === localStorage.getItem("userName") ? (
					<div className="message__chats" key={message.id}>
            <p className='sender__name'>You:</p>
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

        <div className='message__status'>
        <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />   
    </div>
  )

};

export default Chat;