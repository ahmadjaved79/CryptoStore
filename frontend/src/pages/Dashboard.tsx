import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

import UploadBox from "../components/UploadBox";
import FileTable from "../components/FileTable";

import { listFiles, getSharedFiles, downloadFile } from "../api/fileApi";
import type { FileItem } from "../types/file";

type Tab = "my" | "shared";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("shared");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [sharedFiles, setSharedFiles] = useState<FileItem[]>([]);

  const isEditor = user?.role === "editor";

  // 🔐 Protect route
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 📁 Load files
  useEffect(() => {
  if (activeTab === "my" && isEditor) {
    setFiles([]); // 👈 reset first
    listFiles().then(setFiles);
  }

  if (activeTab === "shared") {
    setSharedFiles([]); // 👈 reset first
    getSharedFiles().then(setSharedFiles);
  }
}, [activeTab, isEditor]);


  // ⬇️ Download handler
  const handleDownload = async (file: FileItem) => {
    const blob = await downloadFile(file.id);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = file.filename;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      
      {/* TOP BAR */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-green-400">
          SecureVault Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            Role: <span className="text-white">{user?.role}</span>
          </span>
          <button
            onClick={logout}
            className="bg-red-500 px-4 py-1 rounded font-bold"
          >
            Logout
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="p-6 max-w-6xl mx-auto">

        {/* TABS */}
        <div className="flex gap-4 mb-6">
          {isEditor && (
            <button
              onClick={() => setActiveTab("my")}
              className={`px-4 py-2 rounded ${
                activeTab === "my"
                  ? "bg-green-500 text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              My Files
            </button>
          )}

          <button
            onClick={() => setActiveTab("shared")}
            className={`px-4 py-2 rounded ${
              activeTab === "shared"
                ? "bg-green-500 text-black"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Shared With Me
          </button>
        </div>

        {/* UPLOAD (EDITOR ONLY) */}
        {isEditor && activeTab === "my" && (
          <UploadBox onUploadSuccess={() => listFiles().then(setFiles)} />
        )}

        {/* FILE TABLE */}
        {activeTab === "my" && isEditor && (
          <FileTable
            files={files}
            role="editor"
            onDownload={handleDownload}
          />
        )}

        {activeTab === "shared" && (
          <FileTable
            files={sharedFiles}
            role={user!.role}
            onDownload={handleDownload}
          />
        )}
      </main>
    </div>
  );
}
