"use client";
import { useState, useEffect } from "react";

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/tasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssigneesForTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/taskAssigned/${taskId}`);
      if (!response.ok) throw new Error("Failed to fetch assignees");
      const data = await response.json();
      setAssignees(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAvailableUsers = async (taskId) => {
    try {
      const response = await fetch("http://localhost:5000/api/users");
      const data = await response.json();
      const assignedUsersResponse = await fetch(`http://localhost:5000/api/taskAssigned/${taskId}`);
      const assignedUsers = await assignedUsersResponse.json();
      const assignedUserIds = assignedUsers.map(user => user._id);
      const availableUsers = data.users.filter(user => !assignedUserIds.includes(user._id));
      setUsersList(availableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addAssignees = async (taskId) => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/taskAssigned/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers }),
      });
      if (!response.ok) throw new Error("Failed to add assignees");
      await response.json();
      fetchAssigneesForTask(taskId);
      setSelectedUsers([]);
      alert("Assignees added successfully!");
    } catch (err) {
      alert("Error adding assignees: " + err.message);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      alert("Error deleting task: " + err.message);
    }
  };

  const removeAssignee = async (taskId, userId) => {
    try {
      await fetch(`http://localhost:5000/api/taskAssigned/${taskId}/${userId}`, {
        method: 'DELETE'
      });
      fetchAssigneesForTask(taskId);
    } catch (err) {
      alert("Error removing assignee: " + err.message);
    }
  };

  const toggleUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllUsers = () => {
    const filteredUsers = usersList.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSelectedUsers(prev => 
      prev.length === filteredUsers.length ? [] : filteredUsers.map(user => user._id)
    );
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (editingTask) {
      fetchAvailableUsers(editingTask._id);
      fetchAssigneesForTask(editingTask._id);
    }
  }, [editingTask]);

  if (loading) return (
    <div className="container text-center mt-5">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">{error}</div>
    </div>
  );

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">Task Management</h1>

      <table className="table table-striped table-hover">
        <thead className="table-dark sticky-top">
          <tr>
            <th>Task Name</th>
            <th>Deadline</th>
            <th>Event</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.name}</td>
              <td>{new Date(task.deadline).toLocaleDateString()}</td>
              <td>{task.event?.name}</td>
              <td>
                <button
                  className="btn btn-dark btn-sm me-2"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingTask(task)}
                >
                  Manage Assignees
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTask && (
        <div>
          <h3>Assignees for: {editingTask.name}</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2">
              <button
                className="btn btn-secondary mb-2"
                onClick={toggleAllUsers}
              >
                {selectedUsers.length === usersList.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div
              className="border p-2 rounded mb-3"
              style={{ maxHeight: "200px", overflowY: "auto" }}
            >
              {usersList
                .filter(user => 
                  user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  user.username?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((user) => (
                  <div key={user._id} className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={user._id}
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => toggleUser(user._id)}
                    />
                    <label className="form-check-label" htmlFor={user._id}>
                      {user.username} ({user.email})
                    </label>
                  </div>
                ))}
            </div>
            <button
              className="btn btn-primary mb-3"
              onClick={() => addAssignees(editingTask._id)}
              disabled={selectedUsers.length === 0}
            >
              Assign Selected Users
            </button>
          </div>

          <table className="table table-striped table-hover">
            <thead className="table-dark sticky-top">
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignees.length > 0 ? (
                assignees.map((assignee) => (
                  <tr key={assignee._id}>
                    <td>{assignee.email}</td>
                    <td>{assignee.username}</td>
                    <td>{assignee.status || 'pending'}</td>
                    <td>
                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => removeAssignee(editingTask._id, assignee._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    No assignees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaskManagementPage;