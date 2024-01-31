import React, { useRef, useEffect, useState } from 'react';
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
	// const { category = 'movies'} = props?.match?.params || null;
	const [messages, setMessages] = useState([]);
	const [typingStatus, setTypingStatus] = useState('');
	const lastMessageRef = useRef(null);
	const [quizData, setQuizData] = useState([]);
	const latestResponse = useRef(false);
	const initiateQuiz = useRef(false);
	
	const sendMessageSoundRef = useRef(null);
	const receivedMessageSoundRef = useRef(null);
	const newQuizSoundRef = useRef(null);
	const { audio: sendMessageSound } = useAudio(sendMessageSoundFile, sendMessageSoundRef);
	const { audio: receiveMessageSound } = useAudio(receivedMessageSoundFile, receivedMessageSoundRef);
	const { audio: newQuizSound } = useAudio(newQuizSoundFile, newQuizSoundRef);

	const onInitQuiz = () => {
		console.log("onInitQuiz");
		socket.emit("message", {
				text: "Så ni är redo att quizza? Vilken kategori vill ni köra?", 
				name: "Quizmaestro", 
				id: `${Math.random()}`,
				socketID: `${Math.random()}`,
				role: "admin",
				type: "initiateQuiz",
			}
		)
	}

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
		})

		// socket.emit("message", {
		// 		text: "Bra jobbat! Vill ni köra en till?", 
		// 		name: "Quizmaestro", 
		// 		id: `${Math.random()}`,
		// 		socketID: `${Math.random()}`,
		// 		role: "admin",
		// 		type: "message",
		// 	}
		// )
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
			if (initiateQuiz.current === true) {
				const { text } = data;
				socket.emit('initiateQuiz', { text });
				setQuizData([]);
				initiateQuiz.current = false;
			}
			if (initiateQuiz.current === false && data.role === "admin" && data.type === "initiateQuiz") {
				initiateQuiz.current = true;
			}
			return () => {
				socket.off("messageResponse")
			}

	})

	}, [socket, messages, sendMessageSound, receiveMessageSound])

	useEffect(()=> {
	socket.on("typingResponse", data => setTypingStatus(data))
	}, [socket])

	

	useEffect(() => {
	// 👇️ scroll to bottom every time messages change
	lastMessageRef.current?.scrollIntoView({behavior: 'smooth'});
	}, [messages]);

	
	return (
		<div className="quiz">
			<QuizBar socket={socket} />
			{/* <Quiz socket={socket} /> */}
			{quizData.length > 0 ?
				<Quiz
					onQuizFinished={onQuizFinished}
					socket={socket}
					quiz={quizData} /> : null}
			<div className="quiz-main">
				<QuizHeader onInitQuiz={onInitQuiz}/>
				<Chat
					messages={messages}
					lastMessageRef={lastMessageRef}
					/>
				<ChatFooter typingStatus={typingStatus} socket={socket} />
			</div>
					
		</div>
	);
}

export default QuizView;