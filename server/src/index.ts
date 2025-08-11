// src/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRoutes from "./routes/github";
import testCaseRoutes from "./routes/testCase";
import generateTestCodeRoutes from "./routes/generateRoute";



dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/github", githubRoutes);
app.use("/api/generate", testCaseRoutes); 
app.use("/api/generate", generateTestCodeRoutes);


app.get("/", (_req, res) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
