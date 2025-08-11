import express from "express";
import { generateTestCodeController } from "../controllers/generateTestCodeController";

const router = express.Router();

router.post("/test-code", generateTestCodeController);

export default router;
