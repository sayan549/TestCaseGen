// src/controllers/testCaseController.ts
import { Request, Response } from "express";

export const generateTestCasesController = async (req: Request, res: Response) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid files input" });
    }

    // Simulate test case generation
    const testCases = files.map((file: any, index: number) => ({
      fileName: file.path,
      testCases: [
        { input: "example input 1", output: "expected output 1" },
        { input: "example input 2", output: "expected output 2" },
      ],
    }));

    res.status(200).json({ success: true, data: testCases });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate test cases" });
  }
};
