import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import BackButton from "./BackButton";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function getEventBadge(eventType) {
  if (eventType === "join")
    return <span className="badge badge-join">joined</span>;
  if (eventType === "leave")
    return <span className="badge badge-leave">left</span>;
  if (eventType === "start_class")
    return <span className="badge badge-start_class">class started</span>;
  if (eventType === "end_class")
    return <span className="badge badge-end_class">class ended</span>;
  return null;
}

function getRoleClass(role) {
  if (role === "teacher") return "role-teacher";
  if (role === "student") return "role-student";
  return "";
}

function ManagerView() {
  const [roomId, setRoomId] = useState("");
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (e) => {
    e.preventDefault();
    setError("");
    setLogs([]);
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/classroom/${roomId}/history`);
      setLogs(res.data.logs);
    } catch (err) {
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-container">
      <div className="manager-card">
        <BackButton />
        <h2>Classroom Reports</h2>
        <form onSubmit={fetchLogs} className="manager-input-row">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            required
          />
          <button type="submit">Get Logs</button>
        </form>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        {loading && (
          <div style={{ color: "#6366f1", marginBottom: 12 }}>Loading...</div>
        )}
        {logs.length > 0 && <h3 className="log-section-title">Event Log</h3>}
        <ul className="log-list">
          {logs.map((log, idx) => (
            <li className="log-item" key={idx}>
              <span className="log-timestamp">
                [{new Date(log.timestamp).toLocaleString()}]
              </span>
              <span className={`log-role ${getRoleClass(log.role)}`}>
                {log.role}
              </span>
              <b className="log-name">{log.name}</b>
              {getEventBadge(log.eventType)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManagerView;
