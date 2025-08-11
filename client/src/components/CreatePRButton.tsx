import axios from "axios";
import { toast } from "react-toastify";

type TestCase = {
  fileName: string;
  testCases: { input: string; output: string }[];
};

type Props = {
  testCases: TestCase[];
};

const CreatePRButton = ({ testCases }: Props) => {
  const handleCreatePR = async () => {
    if (!testCases || testCases.length === 0) {
      toast.error("❌ No test cases to submit.");
      return;
    }

    try {
      const res = await axios.post("/api/github/create-pr", {
        testCases,
        owner: "sayan549",
        repo: "TestCaseGen",
        head: "test-case-branch",
        base: "main",
        title: "Add AI-Generated Test Cases",
        body: "This PR includes automatically generated test cases.",
      });

      toast.success("✅ Pull Request Created!");
      if (res.data?.pr_url) {
        window.open(res.data.pr_url, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create pull request");
    }
  };

  return (
    <button
      onClick={handleCreatePR}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
    >
      🚀 Create Pull Request
    </button>
  );
};

export default CreatePRButton;
