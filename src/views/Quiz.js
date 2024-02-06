import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Quiz from '../components/Quiz';
import QuizBar from '../components/QuizBar';
import QuizHeader from '../components/QuizHeader';
import ChatFooter from '../components/ChatFooter';
import Chat from '../components/Chat';
import useAudio from '../hooks/useAudio';

const sendMessageSoundFile = require("../assets/sounds/chat-pop.mp3");
const receivedMessageSoundFile = require("../assets/sounds/chat-received-pop.mp3");
const newQuizSoundFile = require("../assets/sounds/new-quiz.mp3");

const QuizView = (props) => {
	const { socket } = props;
	const { room } = useParams();
	const [messages, setMessages] = useState([]);
	const [typingStatus, setTypingStatus] = useState('');
	const lastMessageRef = useRef(null);
	const [quizData, setQuizData] = useState([]);
	const latestResponse = useRef(false);
	const initiateQuiz = useRef(false);
	const navigate = useNavigate();

	const sendMessageSoundRef = useRef(null);
	const receivedMessageSoundRef = useRef(null);
	const newQuizSoundRef = useRef(null);
	const { audio: sendMessageSound } = useAudio(sendMessageSoundFile, sendMessageSoundRef);
	const { audio: receiveMessageSound } = useAudio(receivedMessageSoundFile, receivedMessageSoundRef);
	const { audio: newQuizSound } = useAudio(newQuizSoundFile, newQuizSoundRef);

	const onInitQuiz = () => {
		socket.emit("message", {
				text: `Så ni är redo att quizza? Vilken kategori vill du köra på ${localStorage.getItem("userName")}?`, 
				name: "Quizmaestro", 
				id: `${socket.id}${Math.random()}`,
				socketID: socket.id,
				role: "admin",
				type: "initiateQuiz",
				room,
			}
		)
	}

	const handleLeaveChat = () => {
		socket.emit("message", {
			text: `Skjuter ut mig, hörs vi 🌴`, 
			name: localStorage.getItem("userName"), 
			id: `${socket.id}${Math.random()}`,
			socketID: socket.id,
			role: "user",
			type: "message",
			room,
		})
		socket.emit('leave', {
			name: localStorage.getItem("userName"),
			socketID: socket.id,
			room
		});

		localStorage.removeItem('userName');
    navigate(`/${room}`);
    window.location.reload();
  };
	

	useEffect(() => {
		socket.on('newQuiz', (data) => {
			console.log('newQuiz', data);
			setQuizData(data.quiz);
			if (newQuizSound.current) {
				newQuizSound.current.play();
			}
		});
	}, [socket, newQuizSound]);

	const onQuizFinished = (result) => {
		console.log("onQuizFinished");
		setQuizData([]);
		initiateQuiz.current = false;

		socket.emit("quizFinished", {
			result, 
			name: localStorage.getItem("userName"), 
			id: `${socket.id}${Math.random()}`,
			socketID: socket.id,
			role: "user",
			type: "result",
			room,
		})
	}
	useEffect(() => {
		socket.on("messageResponse", data => {
			setMessages([...messages, data])
			if (latestResponse.current === data) {
				return
			}
			latestResponse.current = data;
			if (sendMessageSound.current && receiveMessageSound.current) {
				data.name === localStorage.getItem("userName") ?
				sendMessageSound.current.play() :
				receiveMessageSound.current.play();
			}
			
			return () => {
				socket.off("messageResponse")
			}

	})

	}, [socket, messages, sendMessageSound, receiveMessageSound])

	useEffect(()=> {
		socket.on("typingResponse", data => {
			console.log('typingResponse', data)
			setTypingStatus(data)
		})
	}, [socket])


	useEffect(() => {
	// 👇️ scroll to bottom every time messages change
	lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
	}, [messages]);

	
	return (
		<div className="quiz">
			<QuizHeader
					onInitQuiz={onInitQuiz}
					handleLeaveChat={handleLeaveChat}
					room={room}
				/>
			
			{/* <Quiz socket={socket} /> */}
			{quizData.length > 0 ?
				<Quiz
					onQuizFinished={onQuizFinished}
					socket={socket}
					quiz={quizData}
					room={room}/> : null}
			<div className="quiz-main">
				<QuizBar
					socket={socket}
					room={room}
				/>
				<div className="quiz-chat">

				<Chat
					messages={messages}
					lastMessageRef={lastMessageRef}
					/>
				<ChatFooter
					typingStatus={typingStatus}
					socket={socket}
					room={room}
					/>
					</div>
			</div>
					
		</div>
	);
}

export default QuizView;