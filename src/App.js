import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketContext, socket } from "./context/socket";
import Home from "./views/Home";
import QuizView from "./views/Quiz";
import "./styles/main.scss";

function App() {
  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:room" element={<Home />} />
          <Route path="/quiz/:room" element={<QuizView />} />
        </Routes>
      </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;
