import express from "express";
import { getClassroomHistory } from "../controllers/classroomController.js";

const router = express.Router();

router.get("/:roomId/history", getClassroomHistory);

export default router;
