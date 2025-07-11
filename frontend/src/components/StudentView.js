import React from "react";
import "../App.css";

function StudentView({ status, top }) {
  let message = "Wait for the teacher to start the class.";
  let msgClass = "student-message waiting";
  if (status === "in_progress") {
    message = "You are in the classroom.";
    msgClass = "student-message in-progress";
  } else if (status === "ended") {
    message = "The class has ended.";
    msgClass = "student-message ended";
  }
  return (
    <div className={msgClass + (top ? " student-message-top" : "")}>
      {message}
    </div>
  );
}

export default StudentView;
