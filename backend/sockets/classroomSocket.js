import Classroom from "../models/Classroom.js";
import EventLog from "../models/EventLog.js";

export default function classroomSocket(socket, io) {
  async function emitClassroomState(roomId) {
    try {
      const classroom = await Classroom.findOne({ roomId });
      if (classroom) {
        io.to(roomId).emit("update_lists", {
          teachers: classroom.teachers || [],
          students: classroom.students || [],
          allStudents: classroom.allStudents || [],
          status: classroom.status || "not_started",
        });
      } else {
        console.error(`Classroom with roomId ${roomId} not found`);
      }
    } catch (err) {
      console.error("Error emitting classroom state:", err);
    }
  }

  socket.on("join", async ({ roomId, userId, name, role }, callback) => {
    try {
      let classroom = await Classroom.findOne({ roomId });
      if (!classroom) {
        if (role === "teacher") {
          classroom = await Classroom.create({
            roomId,
            teachers: [],
            students: [],
            allStudents: [],
            status: "not_started",
          });
        } else {
          callback && callback({ allowed: false, reason: "Class not started" });
          return;
        }
      }

      if (role === "teacher") {
        const updatedClassroom = await Classroom.findOneAndUpdate(
          { roomId, "teachers.userId": { $ne: userId } },
          { $push: { teachers: { userId, name } } },
          { new: true }
        );
        socket.join(roomId);
        await EventLog.create({
          roomId,
          userId,
          name,
          role,
          eventType: "join",
        });
        await emitClassroomState(roomId);
        callback && callback({ allowed: true, status: classroom.status });
      } else if (role === "student") {
        if (classroom.status !== "in_progress") {
          callback && callback({ allowed: false, reason: "Class not started" });
          return;
        }

        // Update students and allStudents in a single operation to ensure consistency
        await Classroom.findOneAndUpdate(
          { roomId },
          {
            $addToSet: {
              students: { userId, name },
            },
          },
          { new: true }
        );
        await Classroom.findOneAndUpdate(
          { roomId, "allStudents.name": { $ne: name } },
          { $push: { allStudents: { userId, name } } },
          { new: true }
        );
        // Ensure classroom still exists after update
        const classroomAfterStudentAdd = await Classroom.findOne({ roomId });
        if (!classroomAfterStudentAdd) {
          console.error(
            `Failed to update classroom for student join: ${roomId}`
          );
          callback &&
            callback({ allowed: false, reason: "Failed to join class" });
          return;
        }

        socket.join(roomId);
        await EventLog.create({
          roomId,
          userId,
          name,
          role,
          eventType: "join",
        });
        await emitClassroomState(roomId);
        callback && callback({ allowed: true, status: classroom.status });
      }

      socket.data = { roomId, userId, name, role };
    } catch (err) {
      console.error("Error in join event:", err);
      callback && callback({ allowed: false, reason: "Internal server error" });
    }
  });

  socket.on("leave", async () => {
    try {
      const { roomId, userId, role, name } = socket.data || {};
      if (!roomId || !userId) return;

      if (role === "student") {
        await Classroom.findOneAndUpdate(
          { roomId },
          { $pull: { students: { userId } } },
          { new: true }
        );
        await EventLog.create({
          roomId,
          userId,
          name,
          role,
          eventType: "leave",
        });
        await emitClassroomState(roomId);
      }
      socket.leave(roomId);
    } catch (err) {
      console.error("Error in leave event:", err);
    }
  });

  socket.on("start_class", async ({ roomId, userId }) => {
    try {
      const classroom = await Classroom.findOne({ roomId });
      if (classroom && classroom.teachers.some((t) => t.userId === userId)) {
        await Classroom.findOneAndUpdate(
          { roomId },
          { $set: { status: "in_progress" } },
          { new: true }
        );
        const teacher = classroom.teachers.find((t) => t.userId === userId);
        await EventLog.create({
          roomId,
          userId,
          name: teacher ? teacher.name : "Unknown",
          role: "teacher",
          eventType: "start_class",
        });
        await emitClassroomState(roomId);
      }
    } catch (err) {
      console.error("Error in start_class event:", err);
    }
  });

  socket.on("end_class", async ({ roomId, userId }) => {
    try {
      const classroom = await Classroom.findOne({ roomId });
      if (classroom && classroom.teachers.some((t) => t.userId === userId)) {
        await Classroom.findOneAndUpdate(
          { roomId },
          { $set: { status: "ended", students: [] } },
          { new: true }
        );
        const teacher = classroom.teachers.find((t) => t.userId === userId);
        await EventLog.create({
          roomId,
          userId,
          name: teacher ? teacher.name : "Unknown",
          role: "teacher",
          eventType: "end_class",
        });
        await emitClassroomState(roomId);
      }
    } catch (err) {
      console.error("Error in end_class event:", err);
    }
  });

  socket.on("disconnect", async () => {
    try {
      const { roomId, userId, role, name } = socket.data || {};
      if (!roomId || !userId) return;

      if (role === "student") {
        await Classroom.findOneAndUpdate(
          { roomId },
          { $pull: { students: { userId } } },
          { new: true }
        );
        await EventLog.create({
          roomId,
          userId,
          name,
          role,
          eventType: "leave",
        });
        await emitClassroomState(roomId);
      }
      socket.leave(roomId);
    } catch (err) {
      console.error("Error in disconnect event:", err);
    }
  });
}
