import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

type GitHubFile = {
  name: string;
  path: string;
  type: "file" | "dir";
  html_url: string;
};

type TestCase = {
  input: string;
  output: string;
};

type Summary = {
  testCases: TestCase[];
};

const HomePage = () => {
  const [files, setFiles] = useState<GitHubFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<GitHubFile[]>([]);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get("/api/github/files");
        const fetchedFiles = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.files)
          ? res.data.files
          : [];
        setFiles(fetchedFiles);
      } catch (error) {
        console.error("Error fetching files", error);
        setError("Failed to fetch files from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  const toggleFileSelection = (file: GitHubFile) => {
    setSelectedFiles((prev) =>
      prev.find((f) => f.path === file.path)
        ? prev.filter((f) => f.path !== file.path)
        : [...prev, file]
    );
  };

  const fetchSummaries = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }
    try {
      const res = await axios.post("/api/generate/generate-testcases", {
        files: selectedFiles,
      });
      setSummaries(res.data.data);
    } catch (err) {
      console.error("❌ Failed to fetch summaries", err);
      toast.error("Failed to generate summaries");
    }
  };

  const handleGenerateCode = async (input: string, output: string) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/generate/test-code",
        { testCases: [{ input, output }] }
      );
      setGeneratedCode(res.data.code);
    } catch (err) {
      console.error("❌ Failed to generate code", err);
    }
  };

  const resetAll = () => {
    setSelectedFiles([]);
    setSummaries([]);
    setGeneratedCode("");
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h1 className="text-3xl font-bold">GitHub Files</h1>
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Start All Over Again
        </button>
      </div>

      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <li
                key={file.path}
                className="p-4 border rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.some((f) => f.path === file.path)}
                      onChange={() => toggleFileSelection(file)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">
                        {file.type === "dir" ? "📁" : "📄"} {file.name}
                      </p>
                      <p className="text-sm text-gray-600">{file.path}</p>
                    </div>
                  </div>
                  <a
                    href={file.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View ↗
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <button
                onClick={fetchSummaries}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Generate Summaries
              </button>
            </div>
          )}
        </>
      )}

      {summaries.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">🧪 Generated Test Summaries</h2>
          {summaries.map((summary, index) => (
            <div key={index} className="mb-6 border p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Test Summary {index + 1}</h3>
              <ul className="list-disc pl-5 mb-3">
                {summary.testCases.map((test, i) => (
                  <li key={i} className="mb-3">
                    <div>
                      <strong>Input:</strong> {test.input}
                    </div>
                    <div>
                      <strong>Output:</strong> {test.output}
                    </div>
                    <button
                      onClick={() => handleGenerateCode(test.input, test.output)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Generate Test Code
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {generatedCode && (
        <div className="mt-10 border p-4 rounded bg-gray-900 text-green-400">
          <h2 className="text-xl font-bold mb-3">Generated Test Code</h2>
          <pre className="whitespace-pre-wrap">{generatedCode}</pre>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Copy
            </button>
            <button
              onClick={() => {
                const blob = new Blob([generatedCode], { type: "text/javascript" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "generated.test.js";
                link.click();
              }}
              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
            >
              Download
            </button>
            <button
              onClick={async () => {
                try {
                  const branchName = `testcase-${Date.now()}`;
                  const filePath = `tests/generated-${Date.now()}.test.js`;
                  const res = await axios.post("/api/github/save-testcase", {
                    branchName,
                    filePath,
                    fileContent: generatedCode,
                  });
                  toast.success(res.data.message || "✅ Test case saved to GitHub");
                } catch (err: any) {
                  console.error(err);
                  toast.error(
                    err.response?.data?.error || "❌ Failed to save test case"
                  );
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Save to GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
