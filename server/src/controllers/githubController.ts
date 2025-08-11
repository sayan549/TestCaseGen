import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// --- 🔐 GitHub Credentials ---
const token = process.env.GITHUB_TOKEN!;
const owner = "sayan549"; // Update this if using dynamic owner
const repo = "TestCaseGen";

// --- 🧠 MOCK: AI Test Case Generator ---
const generateTestCases = (code: string) => {
  return `
describe("Auto-generated test cases", () => {
  it("should handle valid input", () => {
    // TODO: Add test logic
  });

  it("should handle edge case", () => {
    // TODO: Add test logic
  });
});
  `;
};

// --- ✅ POST /api/github/generate-testcases ---
export const generateTestCasesController = async (req: Request, res: Response) => {
  try {
    const { code, filename } = req.body;

    if (!code || !filename) {
      return res.status(400).json({ error: "Filename and code are required" });
    }

    const testCases = generateTestCases(code);

    res.json({ filename, testCases });
  } catch (error) {
    console.error("Error generating test cases:", error);
    res.status(500).json({ error: "Failed to generate test cases" });
  }
};

// --- ✅ GET /api/github/files ---
export const getGitHubFilesController = async (req: Request, res: Response) => {
  try {
    console.log("GitHub Token: ", process.env.GITHUB_TOKEN);

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch GitHub files" });
  }
};

// --- ✅ POST /api/github/contents ---
export const getGitHubFileContentsController = async (req: Request, res: Response) => {
  const { files } = req.body;

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "No files provided." });
  }

  try {
    const contents = await Promise.all(
      files.map(async (filePath: string) => {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
        const response = await axios.get(url, {
          headers: { Authorization: `token ${token}` },
        });
        const content = Buffer.from(response.data.content, "base64").toString("utf-8");
        return { path: filePath, content };
      })
    );

    res.json({ contents });
  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    res.status(500).json({ error: "Failed to fetch file contents." });
  }
};

// --- ✅ POST /api/github/create-pr ---
export const createPullRequestController = async (req: Request, res: Response) => {
  try {
    const { head, base, title, body } = req.body;

    const response = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        title,
        head,
        base,
        body,
      },
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return res.status(201).json({
      message: "Pull Request Created",
      pr_url: response.data.html_url,
    });
  } catch (error: any) {
    console.error("Error creating PR:", error.response?.data || error.message);
    return res.status(500).json({ error: "Failed to create pull request" });
  }
};


// --- ✅ POST /api/github/save-testcase ---
export const saveTestCaseToGitHubController = async (req: Request, res: Response) => {
  try {
    const { branchName, filePath, fileContent } = req.body;

    if (!branchName || !filePath || !fileContent) {
      return res.status(400).json({ error: "branchName, filePath, and fileContent are required" });
    }

    // Step 1: Get latest commit SHA from main
    const mainBranch = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`,
      { headers: { Authorization: `token ${token}` } }
    );

    const latestCommitSha = mainBranch.data.object.sha;

    // Step 2: Create new branch from main
    await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        ref: `refs/heads/${branchName}`,
        sha: latestCommitSha,
      },
      { headers: { Authorization: `token ${token}` } }
    );

    // Step 3: Convert file content to Base64
    const base64Content = Buffer.from(fileContent, "utf-8").toString("base64");

    // Step 4: Create file in the new branch
    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        message: `Add generated test case: ${filePath}`,
        content: base64Content,
        branch: branchName,
      },
      { headers: { Authorization: `token ${token}` } }
    );

    return res.status(201).json({ message: "✅ Test case saved to GitHub" });
  } catch (error: any) {
    console.error("Error saving test case:", error.response?.data || error.message);
    return res.status(500).json({ error: "❌ Failed to save test case to GitHub" });
  }
};

