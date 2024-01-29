import React, { useState } from 'react';

const QuizFooter = ({ socket }) => {
    const [message, setMessage] = useState("")
    const handleTyping = () => socket.emit("typing",`${localStorage.getItem("userName")} is typing`)

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (message.trim() && localStorage.getItem("userName")) {
        socket.emit("typing", "")
        socket.emit("message", 
            {
                text: message, 
                name: localStorage.getItem("userName"), 
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
                role: "user",
                type: "message",
            }
        )
        }
        setMessage("")
    }
  return (
    <div className='chat__footer'>
        <form className='form' onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder='Surra på...' 
            className='message' 
            value={message} 
            onChange={e => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            />
            <button className="button-submit">Kör</button>
        </form>
     </div>
  )
};

export default QuizFooter;