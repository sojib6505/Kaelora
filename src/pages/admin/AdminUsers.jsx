import { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
 
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const axiosInstance = useAxios();
  const {user} = useAuth()
 
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/admin/users?page=${page}&search=${search}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
     if (!user) return;
     fetchUsers(); }, [page, search,user]);
 
  const handleRoleChange = async (userId, role) => {
    await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
    fetchUsers();
  };
 
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-gray-500 mt-1">{pagination.total || 0} total users</p>
      </div>
 
      <input
        type="text" placeholder="Search name or email..."
        value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
        className="w-full max-w-sm border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />
 
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Joined</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img src={user.photoURL} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-500">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.role === "admin" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString("en-BD")}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        defaultValue={user.role}
                        onChange={e => handleRoleChange(user._id, e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="text-center text-gray-400 py-10">No users found</p>
            )}
          </div>
        )}
      </div>
 
      {pagination.pages > 1 && (
        <div className="flex items-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                page === p ? "bg-black text-white" : "bg-white border hover:bg-gray-50"
              }`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}