import { useState } from "react";
import { uploadFile } from "../api/fileApi";

interface UploadBoxProps {
  onUploadSuccess?: () => void;
}

export default function UploadBox({ onUploadSuccess }: UploadBoxProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      await uploadFile(file); // 🔥 BACKEND CALL
      onUploadSuccess?.();    // 🔁 Refresh file list
      setFile(null);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-6">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-green-500 px-4 py-2 rounded font-bold text-black disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
    </div>
  );
}
