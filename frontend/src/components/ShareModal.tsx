import type { FileItem } from "../types/file";

interface Props {
  file: FileItem;
  onClose: () => void;
}

export default function ShareModal({ file, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-96 border border-green-500">

        <h2 className="text-lg font-bold text-green-400 mb-2">
          Share File
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          File: <span className="text-white">{file.filename}</span>
        </p>

        {/* future: email / role / link */}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 py-2 rounded font-bold"
        >
          Close
        </button>
      </div>
    </div>
  );
}
