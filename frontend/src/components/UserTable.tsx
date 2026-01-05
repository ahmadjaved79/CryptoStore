import type { User, Role } from "../types/user";

interface Props {
  users: User[];
  onRoleChange: (id: string, role: Role) => void;
}

export default function UserTable({ users, onRoleChange }: Props) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-800 text-gray-400">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-t border-gray-800 hover:bg-gray-800"
            >
              <td className="p-3">{user.email}</td>

              <td className="p-3">
                <select
                  value={user.role}
                  onChange={(e) =>
                    onRoleChange(user.id, e.target.value as Role)
                  }
                  className="bg-black border border-gray-700 p-1 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
