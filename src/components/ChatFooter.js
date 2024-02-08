import React, { useState } from 'react';

const ChatFooter = ({ socket, typingStatus, room, isCategoryInput, setIsCategoryInput }) => {
    const [message, setMessage] = useState("")
    const handleTyping = () => socket.emit("typing", {
        message: `${localStorage.getItem("userName")} är på gång...`,
        room,
    })

    const handleSendMessage = (e) => {
			e.preventDefault()
			if (isCategoryInput) {
				setIsCategoryInput(false);
			}
			if (message.trim() && localStorage.getItem("userName")) {
			socket.emit("typing", {
				message: "",
				room,
			})
			socket.emit("message", 
				{
						text: message, 
						name: localStorage.getItem("userName"), 
						id: `${socket.id}${Math.random()}`,
						socketID: socket.id,
						role: "user",
						type: "message",
						room,
				})
			}
			setMessage("")
    }
  return (
      <div className='chat__footer'>
          {typingStatus && (
              <div className='message__status'>
              <p>{typingStatus}</p>
            </div>
          )}
          
        <form className='form' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder={`${isCategoryInput ? 'Välj kategori' : 'Surra på eller ta en quiz...'}`} 
            className='message' 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            />
				<button className="button-submit">{`${isCategoryInput ? 'Välj kategori' : 'Surra'}`}</button>
			</form>
     </div>
  )
};

export default ChatFooter;