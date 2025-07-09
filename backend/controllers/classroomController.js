import EventLog from "../models/EventLog.js";

export const getClassroomHistory = async (req, res) => {
  const { roomId } = req.params;
  try {
    const logs = await EventLog.find({ roomId }).sort({ timestamp: 1 });
    res.json({ roomId, logs });
  } catch (err) {
    console.error('Error fetching classroom history:', err);
    res.status(500).json({ error: 'Failed to fetch classroom history' });
  }
};
