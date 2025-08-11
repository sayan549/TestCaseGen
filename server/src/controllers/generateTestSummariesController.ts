// src/controllers/generateTestSummariesController.ts
import { Request, Response } from "express";

export const generateTestSummariesController = async (req: Request, res: Response) => {
  try {
    const { files } = req.body;

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ error: "Invalid files input" });
    }

    const summaries = files.map((file: any) => ({
      filePath: file.path,
      summary: `Generate unit tests for ${file.path.split('/').pop()}`,
    }));

    res.status(200).json({ success: true, data: summaries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate summaries" });
  }
};
