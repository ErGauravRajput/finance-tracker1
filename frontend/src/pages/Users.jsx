import { useEffect, useState } from "react";
import { api } from "../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/users");
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users. You might not be an Admin.");
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="page">
      <h2>User Management (Admin)</h2>
      {error && <p className="error">{error}</p>}
      
      <table className="table">
        <thead>
          {/* Removed comments inside TR to prevent hydration errors */}
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <span className={`role-pill ${u.role === "admin" ? "admin" : ""}`}>
                  {u.role}
                </span>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                {u.role !== 'admin' && (
                  <button 
                    className="btn-danger" 
                    style={{fontSize: '0.7rem', padding: '0.3rem 0.6rem'}}
                    onClick={async () => {
                        if(confirm('Delete user?')) {
                            await api.delete(`/users/${u.id}`);
                            setUsers(users.filter(user => user.id !== u.id));
                        }
                    }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && !error && (
            <tr><td colSpan="6" style={{textAlign:"center"}}>No users found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Users;