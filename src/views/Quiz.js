import React, { useRef, useEffect, useState } from 'react';
import Quiz from '../components/Quiz';
import QuizBar from '../components/QuizBar';
import QuizHeader from '../components/QuizHeader';
import QuizFooter from '../components/QuizFooter';
import Chat from '../components/Chat';

const QuizView = (props) => {
	const { socket } = props;
	// const { category = 'movies'} = props?.match?.params || null;
	const [messages, setMessages] = useState([]);
	const [typingStatus, setTypingStatus] = useState('');
	const lastMessageRef = useRef(null);
	const [quizData, setQuizData] = useState([]);
	const latestResponse = useRef(false);
	const initiateQuiz = useRef(false);

		
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

			console.log(`messageResponse`, data);
			
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

	}, [socket, messages])

	useEffect(()=> {
	socket.on("typingResponse", data => setTypingStatus(data))
	}, [socket])

	useEffect(() => {
		socket.on('newQuiz', (data) => {
			console.log('newQuiz', data);
			setQuizData(data.quiz);
		});
	}, [socket]);

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
					typingStatus={typingStatus}
					lastMessageRef={lastMessageRef}
					onInitQuiz={onInitQuiz}
					/>
				<QuizFooter socket={socket} />
			</div>
					
		</div>
	);
}

export default QuizView;