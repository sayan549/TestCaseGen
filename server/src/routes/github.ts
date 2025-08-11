import express from "express";
import {
  getGitHubFilesController,
  getGitHubFileContentsController,createPullRequestController,saveTestCaseToGitHubController,
} from "../controllers/githubController";

const router = express.Router();

// ✅ Route to get list of files in a GitHub repo
router.get("/files", getGitHubFilesController);

// ✅ Route to get contents of selected files
router.post("/contents", getGitHubFileContentsController);

// ✅ Save generated test case to GitHub
router.post("/save-testcase", saveTestCaseToGitHubController);

// ✅ Day 6: Create pull request
router.post("/create-pr", createPullRequestController);

export default router;
