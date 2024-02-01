import { BrowserRouter, Routes, Route } from 'react-router-dom';
import socketIO from 'socket.io-client';
import Home from './views/Home';
import QuizView from './views/Quiz';
import './styles/main.scss';

const apiURL = process.env.REACT_APP_API_BASE_URL;
const socket = socketIO.connect(apiURL);

function App() {
  return (
    <BrowserRouter>
    <div>
      <Routes>
        <Route path="/" element={<Home socket={socket} />}></Route>
        <Route path="/:room" element={<Home socket={socket} />}></Route>
        <Route path="/quiz/:room" element={<QuizView socket={socket} />}></Route>
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
