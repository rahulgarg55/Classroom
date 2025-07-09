import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Classroom from "../components/Classroom";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function ClassroomPage() {
  const { roomId } = useParams();
  const [status, setStatus] = useState("not_started");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [allowed, setAllowed] = useState(null);
  const [reason, setReason] = useState("");
  const socketRef = useRef();

  const name = localStorage.getItem("userName");
  const role = localStorage.getItem("userRole");
  const userId = name + "-" + role;

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("join", { roomId, userId, name, role }, (res) => {
      setAllowed(res.allowed);
      setStatus(res.status);
      if (!res.allowed && res.reason) setReason(res.reason);
    });
    socket.on("update_lists", ({ teachers, students, status }) => {
      setTeachers(teachers);
      setStudents(students);
      setStatus(status);
    });
    return () => {
      socket.emit("leave");
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [roomId, userId, name, role]);

  if (allowed === false) {
    return (
      <div style={{ padding: 32 }}>
        <h2>Access Denied</h2>
        <p>{reason}</p>
      </div>
    );
  }
  if (!allowed) {
    return <div style={{ padding: 32 }}>Joining classroom...</div>;
  }

  return (
    <Classroom
      roomId={roomId}
      status={status}
      teachers={teachers}
      students={students}
      role={role}
      socket={socketRef.current}
      userId={userId}
    />
  );
}

export default ClassroomPage;
