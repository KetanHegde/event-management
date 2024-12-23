"use client";
import { useState, useEffect } from "react";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      // Filter users to only include Attendees
      const attendees = data.users.filter(user => user.role === "Attendee");
      setUsers(attendees);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE'
      });
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      alert("Error deleting user: " + err.message);
    }
  };

  const editUser = async (userId, updatedData) => {
    try {
      // Ensure we preserve the role when updating
      const dataWithRole = { ...updatedData, role: "Attendee" };
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataWithRole)
      });
      const data = await response.json();
      setUsers(users.map(user => user._id === userId ? data : user));
      setEditingUser(null);
    } catch (err) {
      alert("Error updating user: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Attendee Management</h1>
      
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search attendees by email or username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className="table table-striped table-hover">
          <thead className="table-dark sticky-top">
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <button
                    className="btn btn-dark btn-sm me-2"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingUser(user)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center p-3">
            <p className="text-muted">No attendees found</p>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="container-fluid mt-3 p-3 border rounded bg-light">
          <div className="d-flex justify-content-between mb-3">
            <h4>Edit Attendee</h4>
            <button 
              className="btn-close" 
              onClick={() => setEditingUser(null)}
            ></button>
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={editingUser.email}
              onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={editingUser.username}
              onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
            <button
              className="btn btn-dark"
              onClick={() => editUser(editingUser._id, editingUser)}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;