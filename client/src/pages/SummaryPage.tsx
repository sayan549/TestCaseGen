// src/pages/SummaryPage.tsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface SummaryPageProps {
  selectedFile: string;
  generatedCode: string;
}

const SummaryPage: React.FC<SummaryPageProps> = ({ selectedFile, generatedCode }) => {
  const [saving, setSaving] = useState(false);

  const handleSaveToGitHub = async () => {
    if (!generatedCode) {
      toast.error("No generated code to save!");
      return;
    }

    setSaving(true);
    try {
      const res = await axios.post("http://localhost:5000/api/github/save", {
        filePath: selectedFile,
        content: generatedCode,
      });

      if (res.status === 200) {
        toast.success("✅ Test case saved to GitHub!");
      } else {
        toast.error("❌ Failed to save test case");
      }
    } catch (error) {
      console.error(error);
      toast.error("❌ Error saving to GitHub");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Generated Test Case</h2>
      <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto">
        {generatedCode}
      </pre>
      <button
        onClick={handleSaveToGitHub}
        disabled={saving}
        className={`mt-4 px-4 py-2 rounded-md text-white ${
          saving ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "💾 Save to GitHub"}
      </button>
    </div>
  );
};

export default SummaryPage;
