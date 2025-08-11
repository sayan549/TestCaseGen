import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type TestCase = {
  filePath: string;
  testCases: string;
};

const ResultPage = () => {
  const [results, setResults] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);

  // Load test cases from localStorage
  useEffect(() => {
    const data = localStorage.getItem("testCases");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          setResults(parsed);
        } else {
          console.error("Invalid data format: not an array");
          toast.error("Invalid test case data.");
        }
      } catch (err) {
        console.error("Failed to parse test cases:", err);
        toast.error("Error loading saved test cases.");
      }
    }
  }, []);

  // Create PR with test cases
  const handleCreatePR = async () => {
    if (results.length === 0) {
      toast.error("❌ No test cases to submit.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/generate/pr-create", {
        testCases: results,
      });

      toast.success("✅ Pull request created successfully!");

      if (res.data?.pr_url) {
        window.open(res.data.pr_url, "_blank");
      }

      console.log("PR created:", res.data);
    } catch (err: any) {
      console.error("PR creation error:", err.response?.data || err.message);
      toast.error("❌ Failed to create pull request.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartOver = () => {
    localStorage.removeItem("testCases");
    window.location.href = "/";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">🧪 Generated Test Cases</h1>

      {results.length === 0 ? (
        <p className="text-gray-600">No test cases available.</p>
      ) : (
        <div className="space-y-6">
          {results.map((item, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <h2 className="font-semibold text-lg mb-2">{item.filePath}</h2>
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto text-sm whitespace-pre-wrap">
                {item.testCases}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button
          onClick={handleCreatePR}
          disabled={loading}
          className={`px-5 py-2 rounded text-white transition ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating PR..." : "🚀 Create Pull Request"}
        </button>

        <button
          onClick={handleStartOver}
          className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded transition"
        >
          🔁 Start Over
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
