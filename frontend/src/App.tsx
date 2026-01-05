import { useEffect, useState } from "react";

type FileItem = {
  name: string;
};

const BACKEND_URL = "http://localhost:5000";

function App() {
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/files`)
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error(err));
  }, []);

  const downloadFile = async (filename: string) => {
    const res = await fetch(`${BACKEND_URL}/download/${filename}`);
    const data = await res.json();
    window.open(data.downloadUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          📁 Secure File Storage
        </h1>

        {files.length === 0 ? (
          <p className="text-gray-500 text-center">No files uploaded</p>
        ) : (
          <ul className="space-y-3">
            {files.map((file) => (
              <li
                key={file.name}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span>{file.name}</span>
                <button
                  onClick={() => downloadFile(file.name)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
