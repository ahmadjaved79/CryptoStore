import { useAuthStore } from "../store/auth.store";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-4">Dashboard</h1>

      {user?.role === "editor" && (
        <p className="text-green-400">Editor: upload & edit files</p>
      )}

      {user?.role === "viewer" && (
        <p className="text-blue-400">Viewer: view & download only</p>
      )}
    </div>
  );
}
