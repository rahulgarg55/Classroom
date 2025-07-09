import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClassroomPage from "./pages/ClassroomPage";
import ManagerView from "./components/ManagerView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/classroom/:roomId" element={<ClassroomPage />} />
        <Route path="/manager" element={<ManagerView />} />
      </Routes>
    </Router>
  );
}

export default App;
