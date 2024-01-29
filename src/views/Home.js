import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch'; 
import '../App.css';

const Home = ({ socket }) => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { userName } = inputs
    console.log('userName', userName);
		localStorage.setItem('userName', userName);
    socket.emit('newUser', { userName, socketID: socket.id });


    navigate(`/quiz`);
  };

	
  const onHandleChange = async (event) => {
    const name = event.target.name;
    const value = event.target.value;
    await setInputs(values => ({ ...values, [name]: value }));
    
  }

    
  return (
    <div className="home">
      <div className="home-login-form">
        <h2 className="">Välkommen!</h2>
        <p className="home__text">Vad heter du?</p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder='Ditt namn'
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
          <button className="button-submit">Börja Quiz</button>
        </form>
      </div>
    </div>
  );
};

export default Home;