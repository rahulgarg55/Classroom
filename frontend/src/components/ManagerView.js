import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function getEventBadge(eventType) {
  if (eventType === 'join') return <span className="badge badge-join">join</span>;
  if (eventType === 'leave') return <span className="badge badge-leave">leave</span>;
  if (eventType === 'start_class') return <span className="badge badge-start_class">start</span>;
  if (eventType === 'end_class') return <span className="badge badge-end_class">end</span>;
  return null;
}

function ManagerView() {
  const [roomId, setRoomId] = useState('');
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async (e) => {
    e.preventDefault();
    setError('');
    setLogs([]);
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/classroom/${roomId}/history`);
      setLogs(res.data.logs);
    } catch (err) {
      setError('Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-container">
      <div className="manager-card">
        <h2>Classroom Reports</h2>
        <form onSubmit={fetchLogs} className="manager-input-row">
          <input
            type="text"
            placeholder="Room ID"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
            required
          />
          <button type="submit">Get Logs</button>
        </form>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        {loading && <div style={{ color: '#6366f1', marginBottom: 12 }}>Loading...</div>}
        <ul className="log-list">
          {logs.map((log, idx) => (
            <li className="log-item" key={idx}>
              <span style={{ color: '#888', minWidth: 160 }}>
                [{new Date(log.timestamp).toLocaleString()}]
              </span>
              <b style={{ color: log.role === 'teacher' ? '#3730a3' : '#047857' }}>{log.role}</b>
              <b>{log.name}</b>
              {getEventBadge(log.eventType)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ManagerView; 