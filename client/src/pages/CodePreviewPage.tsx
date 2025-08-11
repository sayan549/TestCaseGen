import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const CodePreviewPage: React.FC = () => {
  const location = useLocation();
  const { testCode, filePath } = location.state || {};
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSaveToGitHub = async () => {
    if (!testCode || !filePath) {
      setMessage("Missing test code or file path.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response = await axios.post("/api/github/save-test", {
        filePath,
        content: testCode,
      });

      if (response.data.success) {
        setMessage("✅ Test case saved to GitHub successfully!");
      } else {
        setMessage("⚠️ Failed to save test case.");
      }
    } catch (error) {
      console.error("Error saving to GitHub:", error);
      setMessage("❌ Error while saving to GitHub.");
    }

    setIsSaving(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Generated Test Code</h1>

      <pre className="bg-gray-900 text-green-400 p-4 rounded-md overflow-x-auto">
        {testCode || "No code generated."}
      </pre>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleSaveToGitHub}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "💾 Save to GitHub"}
        </button>

        {message && (
          <span
            className={`ml-2 ${
              message.includes("✅")
                ? "text-green-500"
                : message.includes("❌")
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </div>
  );
};

export default CodePreviewPage;
