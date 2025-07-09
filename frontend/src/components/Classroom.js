import React from "react";
import TeacherView from "./TeacherView";
import StudentView from "./StudentView";
import "../App.css";

function getStatusBadge(status) {
  if (status === "in_progress")
    return <span className="status-badge status-in_progress">In Progress</span>;
  if (status === "ended")
    return <span className="status-badge status-ended">Ended</span>;
  return <span className="status-badge">Not Started</span>;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function Classroom({
  roomId,
  status,
  teachers,
  students,
  role,
  socket,
  userId,
}) {
  return (
    <div className="classroom-container">
      <div className="classroom-header">
        <div className="classroom-title">
          Classroom
          {getStatusBadge(status)}
        </div>
        {role === "teacher" && (
          <div className="teacher-controls">
            <TeacherView
              roomId={roomId}
              userId={userId}
              socket={socket}
              status={status}
            />
          </div>
        )}
      </div>
      <div className="lists-row">
        <div className="list-card">
          <div className="list-title">Student List</div>
          <ul>
            {students.length === 0 && (
              <li style={{ color: "#aaa" }}>No students</li>
            )}
            {students.map((s) => (
              <li key={s.userId}>
                <span className="avatar">{getInitials(s.name)}</span> {s.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="list-card">
          <div className="list-title">Teacher List</div>
          <ul>
            {teachers.length === 0 && (
              <li style={{ color: "#aaa" }}>No teachers</li>
            )}
            {teachers.map((t) => (
              <li key={t.userId}>
                <span className="avatar">{getInitials(t.name)}</span> {t.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {role === "student" && <StudentView />}
    </div>
  );
}

export default Classroom;
