import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import classroomRoutes from "./routes/classroomRoutes.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/classroom", classroomRoutes);

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
