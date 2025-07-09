import React from "react";

function TeacherView({ roomId, userId, socket, status }) {
  const handleStart = () => {
    socket.emit("start_class", { roomId, userId });
  };
  const handleEnd = () => {
    socket.emit("end_class", { roomId, userId });
  };
  return (
    <>
      <button onClick={handleStart} disabled={status === "in_progress"}>Start Class</button>
      <button onClick={handleEnd} disabled={status !== "in_progress"}>End Class</button>
    </>
  );
}

export default TeacherView;
