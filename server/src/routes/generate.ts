// src/routes/generate.ts
import express from "express";
import { generateTestSummariesController } from "../controllers/generateTestSummariesController";

const router = express.Router();

router.post("/generate/summaries", generateTestSummariesController);

export default router;
