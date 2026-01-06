import { useEffect, useState } from "react";
import { getUsers } from "../api/adminApi";
import { shareFile } from "../api/fileApi";
import type { FileItem } from "../types/file";
import type { User } from "../types/user";

interface Props {
  file: FileItem;
  onClose: () => void;
}

export default function ShareModal({ file, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

 

const handleShare = async () => {
  if (!selectedUser) return;

  await shareFile(file.id, selectedUser);
  setSuccess("File shared successfully");

  setTimeout(() => {
    onClose();
  }, 1200);
};

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96 border border-green-500">
        <h2 className="text-lg font-bold text-green-400 mb-3">
          Share File
        </h2>

        <p className="text-sm text-gray-400 mb-3">
          File: <span className="text-white">{file.filename}</span>
        </p>

        <select
          className="w-full p-2 bg-black border border-gray-700 rounded mb-4"
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.email} ({u.role})
            </option>
          ))}
        </select>

        <button
          onClick={handleShare}
          className="w-full bg-green-500 py-2 rounded font-bold text-black"
        >
          Share
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full text-gray-400 hover:text-white"
        >
          Cancel
        </button>
        {success && (
  <p className="text-green-400 text-sm mb-2">{success}</p>
)}

      </div>
    </div>
  );
}
