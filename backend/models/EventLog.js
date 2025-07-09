import mongoose from "mongoose";

const eventLogSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  eventType: {
    type: String,
    enum: ["join", "leave", "start_class", "end_class"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("EventLog", eventLogSchema);
