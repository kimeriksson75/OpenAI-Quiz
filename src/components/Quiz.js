import React, { useRef, useEffect, useState, useCallback } from 'react';

const Quiz = (props) => {
	const { socket, quiz = [], onQuizFinished } = props;
	const [answers, setAnswers] = useState([]);
	const [userAnswer, setUserAnswer] = useState(null);
	const [round, setRound] = useState(0);
	const [finished, setFinished] = useState(false);

    
	const onAnswer = async (answer) => {
		setUserAnswer(answer);
		setAnswers([...answers, answer]);
		if (answer === quiz[round].correctAnswer) {
				
				console.log('correct answer');
		}
		console.log('answers', answers);
		await new Promise((resolve, reject) => setTimeout(resolve, 2000));
		if (round < quiz.length - 1) {
			setRound(round + 1);
			setUserAnswer(null);
			return;
		}
		
		setFinished(true);	
        
	}

	useEffect(() => {
		if (finished) {
			console.log('finished', quiz);
			const quizResult = answers.reduce((acc, answer, i) => {
				if (answer === quiz[i].correctAnswer) {
					acc.correctAnswers++;
				}
				return acc;
			}, { correctAnswers: 0 });
			onQuizFinished(quizResult)
			setRound(0);
			setAnswers([]);

		}
		return () => {
			setFinished(false);
			setRound(0);
		}
	},[finished]);
	
	const renderClassName = useCallback((answer) => {
		if (userAnswer === null) {
			return '';
		}
		if (answer === userAnswer === quiz[round].correctAnswer) {
			return 'button-disabled button-correct';
		}
		if (answer === userAnswer && userAnswer !== quiz[round].correctAnswer) {
			return 'button-disabled button-wrong';
		}

		if (answer === quiz[round].correctAnswer) {
			return 'button-disabled button-correct';
		}
		return 'button-disabled'

	 }, [userAnswer]);
    if (quiz.length === 0) {
        return null;
    }
    return (
        <div className="modal">
            <div className="modal-dialog">
					<div className="quiz-component">
						<h2>{ `Quiz kategori ${quiz[0]?.category}`}</h2>
						<h3>{`Runda ${round+1} av ${quiz.length}`}</h3>
						
                <p>{quiz[round].question}</p>
                <ul>

                {quiz[round].answers.map((answer, i) => {
                    return <li key={`key${i}`}>
											<button disabled={userAnswer} className={`${renderClassName(answer)}`} id={`answer-${i}`} onClick={() => onAnswer(answer)}>{answer}</button>
                    </li>;
                })}
                </ul>
            
                </div>
            </div>
        </div>
        
    )
}

export default Quiz;