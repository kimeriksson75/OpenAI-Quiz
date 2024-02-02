import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const QuizHeader = ({ onInitQuiz, handleLeaveChat, room }) => {
	const [copied, setCopied] = useState(false);
	const [value] = useState(`${window?.location?.origin}/${room}`);
	const onInvite = async () => {
		setCopied(true);
		await new Promise((resolve) => setTimeout(() => {
			setCopied(false);
			resolve();
		
		}, 2000));
	}

	const renderInviteText = () => {
		if (copied) {
			return 'Länk kopierad';
		}
		return 'Bjud in';
	}
	return (
		<header className='chat__mainHeader'>
			<p>{room.replace(/-/g, ' ' )}</p>
			<div className="button-group">
				<CopyToClipboard text={value} onCopy={() => onInvite()}>
					<button className='button-primary'>{renderInviteText()}</button>
				</CopyToClipboard>
				<button className='button-primary' onClick={onInitQuiz}>Quizza</button>
				<button className='button-secondary' onClick={handleLeaveChat}>Hejdå!</button>
			</div>
		</header>
	)
}

export default QuizHeader;