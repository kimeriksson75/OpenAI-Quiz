import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

const Home = ({ socket }) => {
  const { room = null} = useParams();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [generateRoomName, setGenerateRoomName] = useState(room || null);
  const isFetching = useRef(false);

  const colors = [
    '034732',
    '008148',
    'C6C013',
    'EF8A17',
    'EF2917',
    '5B7B7A',
    '565676',
    '262626'
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    const { userName } = inputs
    const color = colors[Math.floor(Math.random() * colors.length)];
    console.log('userName', userName);
		localStorage.setItem('userName', userName);
		localStorage.setItem('color', color);
    
    socket.connect({
      query: {
        name: userName,
        socketID: socket.id,
        room: generateRoomName,
      }
    });
    socket.emit('join', { name: userName, color, socketID: socket.id, room: generateRoomName});
    navigate(`/quiz/${generateRoomName}`);
  };

	
  const onHandleChange = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    await setInputs(values => ({ ...values, [name]: value }));
    
  };

  useEffect(() => {
    console.log('generateRoomName', generateRoomName);
    if (!generateRoomName && !isFetching.current) {
      isFetching.current = true;
      socket.emit('generateRandomName', null);

      socket.on('generateRandomNameResponse', (data) => {
        isFetching.current = false;
        console.log('generateRandomNameResponse', data?.randomName);
        setGenerateRoomName(data.randomName);
      });
    }


  }, [socket, generateRoomName, setGenerateRoomName, isFetching]);

    
  return (
    <div className="home">
      <header className="home-header">
      
        </header>
      <div className="home-login-form">
      <h1 className="">Hej,</h1>
        {generateRoomName ? <div>
          <p className="">du kommer ansluta till rum</p>
          <h4>{generateRoomName}.</h4>
          <div className="divider"></div>
        </div> : 
          <p>Genererar ett rum för din quiz, hold on.</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="userName">ditt namn tack</label>
          <input
            placeholder='Ann-Sofie t ex'
            className={`input ${errors.userName ? "error" : ""}`}
            onChange={onHandleChange} 
            name="userName"
            id="userName"
            data-testid="userName"
            label="Användarnamn:"
            value={inputs.userName || ""} 
            type="text" />
          <div className="form error-message">
            {errors.userName ? errors.userName : null}
          </div>
          <button disabled={!generateRoomName} className="button-submit">Börja Quiz</button>
        </form>
      </div>
    </div>
  );
};

export default Home;