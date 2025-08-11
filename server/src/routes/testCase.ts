// src/routes/testCase.ts
import express from "express";
import { generateTestCasesController } from "../controllers/testCaseController";

const router = express.Router();

router.post("/generate-testcases", generateTestCasesController);

export default router;
