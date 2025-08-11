// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ResultPage from "./pages/ResultPage";
import SummaryPage from "./pages/SummaryPage";
import CodePreviewPage from "./pages/CodePreviewPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import "./index.css"; // Ensure you have an index.css file for global styles


function App() {
  return (
    <Router>
      {/* Toast containers should be outside Routes */}
      <ToastContainer />
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/summaries" element={<SummaryPage />} />
        <Route path="/code-preview" element={<CodePreviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
