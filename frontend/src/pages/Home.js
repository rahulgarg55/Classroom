import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && name && role) {
      localStorage.setItem("userName", name);
      localStorage.setItem("userRole", role);
      navigate(`/classroom/${roomId}`);
    }
  };

  return (
    <div className="center-container">
      <div className="card">
        <h2>Join Classroom</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          <button type="submit">Join</button>
        </form>
        <a className="manager-link" href="/manager">
          Manager: View Reports
        </a>
      </div>
    </div>
  );
}

export default Home;
