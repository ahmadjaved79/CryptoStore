import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import type { FileItem } from "../types/file";
import type { User } from "../types/user";
import { listFiles } from "../api/fileApi";
import { getUsers, updateUserRole, getAuditLogs } from "../api/adminApi";

import UploadBox from "../components/UploadBox";
import FileTable from "../components/FileTable";
import UserTable from "../components/UserTable";
import ShareModal from "../components/ShareModal";
import { downloadFile } from "../api/fileApi";


type Tab = "files" | "users" | "logs";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<Tab>("files");
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
 const [files, setFiles] = useState<FileItem[]>([]);
const [users, setUsers] = useState<User[]>([]);
const [logs, setLogs] = useState<any[]>([]); // logs can stay any for now

  // 🔐 Protect admin route
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, [user, navigate]);

  // 📁 Load files
  useEffect(() => {
    if (activeTab === "files") {
      listFiles().then(setFiles);
    }
  }, [activeTab]);

  // 👤 Load users
  useEffect(() => {
    if (activeTab === "users") {
      getUsers().then(setUsers);
    }
  }, [activeTab]);

  // 🧾 Load audit logs
  useEffect(() => {
    if (activeTab === "logs") {
      getAuditLogs().then(setLogs);
    }
  }, [activeTab]);

  const handleRoleChange = async (userId: string, role: string) => {
    await updateUserRole(userId, role);
    const updated = await getUsers();
    setUsers(updated);
  };
  
  const handleDownload = async (file) => {
  const blob = await downloadFile(file.id);
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = file.filename;
  a.click();

  window.URL.revokeObjectURL(url);
};


  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 p-5 hidden md:block">
        <h2 className="text-green-400 font-bold text-xl mb-8">
          🔐 SecureVault
        </h2>

        <nav className="space-y-3">
          <button onClick={() => setActiveTab("files")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "files" ? "bg-green-500 text-black" : "hover:bg-gray-800"
            }`}>
            📁 Files
          </button>

          <button onClick={() => setActiveTab("users")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "users" ? "bg-green-500 text-black" : "hover:bg-gray-800"
            }`}>
            👤 Users
          </button>

          <button onClick={() => setActiveTab("logs")}
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "logs" ? "bg-green-500 text-black" : "hover:bg-gray-800"
            }`}>
            🧾 Audit Logs
          </button>
        </nav>

        <button
          onClick={logout}
          className="mt-10 w-full bg-red-500 py-2 rounded font-bold"
        >
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">

        {/* FILES */}
        {activeTab === "files" && (
          <>
            <h1 className="text-2xl font-bold mb-4">📁 File Management</h1>
            <UploadBox onUploadSuccess={() => listFiles().then(setFiles)} />
           <FileTable
  files={files}
  role="admin"
  onDownload={handleDownload}
  onShare={(file) => setShareFile(file)}
/>
          </>
        )}

        {/* USERS */}
        {activeTab === "users" && (
          <>
            <h1 className="text-2xl font-bold mb-4">👤 User Management</h1>
            <UserTable users={users} onRoleChange={handleRoleChange} />
          </>
        )}

        {/* AUDIT LOGS */}
        {activeTab === "logs" && (
          <>
            <h1 className="text-2xl font-bold mb-4">🧾 Audit Logs</h1>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-green-400">
                  <tr>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Action</th>
                    <th className="text-left p-2">File</th>
                    <th className="text-left p-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={i} className="border-t border-gray-800">
                      <td className="p-2">{log.users?.email}</td>
                      <td className="p-2">{log.action}</td>
                      <td className="p-2">{log.files?.filename}</td>
                      <td className="p-2">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

         {shareFile && (
  <ShareModal
    file={shareFile}
    onClose={() => setShareFile(null)}
  />
)}

      </main>
    </div>
  );
}
