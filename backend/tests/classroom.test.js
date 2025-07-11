import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import Classroom from "../models/Classroom.js";

describe("LIVE Classroom API", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/classroom_test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Classroom.deleteMany({});
  });

  it("GET /api/health should return ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  it("GET /api/classroom/:roomId/history should return logs", async () => {
    await Classroom.create({ roomId: "testroom", allStudents: [] });
    const res = await request(app).get("/api/classroom/testroom/history");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("roomId", "testroom");
    expect(res.body).toHaveProperty("logs");
    expect(Array.isArray(res.body.logs)).toBe(true);
  });

  it("should add multiple unique students to allStudents", async () => {
    await Classroom.create({ roomId: "testroom", allStudents: [] });
    const students = [
      { userId: "student1", name: "Student 1" },
      { userId: "student2", name: "Student 2" },
      { userId: "student3", name: "Student 3" },
    ];
    for (const student of students) {
      await Classroom.findOneAndUpdate(
        { roomId: "testroom", "allStudents.userId": { $ne: student.userId } },
        { $push: { allStudents: student } }
      );
    }
    const classroom = await Classroom.findOne({ roomId: "testroom" });
    expect(classroom.allStudents.length).toBe(3);
    expect(classroom.allStudents.map((s) => s.userId)).toEqual(
      expect.arrayContaining(["student1", "student2", "student3"])
    );
  });

  it("should not add duplicate students to allStudents", async () => {
    await Classroom.create({
      roomId: "testroom",
      allStudents: [{ userId: "student1", name: "Student 1" }],
    });
    await Classroom.findOneAndUpdate(
      { roomId: "testroom", "allStudents.userId": { $ne: "student1" } },
      { $push: { allStudents: { userId: "student1", name: "Student 1" } } }
    );
    const classroom = await Classroom.findOne({ roomId: "testroom" });
    expect(
      classroom.allStudents.filter((s) => s.userId === "student1").length
    ).toBe(1);
  });
});
