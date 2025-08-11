// src/components/FileSelector.tsx
import { useState } from "react";

interface File {
  path: string;
  content: string;
}

const FileSelector = ({
  files,
  onSubmit,
}: {
  files: File[];
  onSubmit: (selected: File[]) => void;
}) => {
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

  const handleToggle = (path: string) => {
    setSelectedPaths((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleSubmit = () => {
    const selected = files.filter((f) => selectedPaths.includes(f.path));
    onSubmit(selected);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Select Files</h2>
      <ul className="mb-4">
        {files.map((file) => (
          <li key={file.path}>
            <label>
              <input
                type="checkbox"
                checked={selectedPaths.includes(file.path)}
                onChange={() => handleToggle(file.path)}
              />
              <span className="ml-2">{file.path}</span>
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmit}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        🧪 Generate Test Cases
      </button>
    </div>
  );
};

export default FileSelector;
