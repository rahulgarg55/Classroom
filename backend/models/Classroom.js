import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const classroomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "ended"],
    default: "not_started",
  },
  teachers: [participantSchema],
  students: [participantSchema],
});

export default mongoose.model("Classroom", classroomSchema);
