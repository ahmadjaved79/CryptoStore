import type { FileItem } from "../types/file";

interface Props {
  files: FileItem[];
  role: "admin" | "editor" | "viewer";
  onDownload: (file: FileItem) => void;
  onShare?: (file: FileItem) => void;
}

export default function FileTable({
  files,
  role,
  onDownload,
  onShare,
}: Props) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 text-gray-400">
          <tr>
            <th className="p-3 text-left">File Name</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {files.map((file) => (
            <tr
              key={file.id}
              className="border-t border-gray-800 hover:bg-gray-800"
            >
               <td className="p-3">{file.filename}</td>

              <td className="p-3 flex gap-3">
                <button
                  onClick={() => onDownload(file)}
                  className="text-cyan-400 hover:underline"
                >
                  Download
                </button>

                {role === "admin" && onShare && (
                  <button
                    onClick={() => onShare(file)}
                    className="text-green-400 hover:underline"
                  >
                    Share
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
