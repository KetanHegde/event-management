"use client";

import React, { useState, useEffect } from "react";

const EventForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    attendees: [],
  });
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Apply filter when searchTerm changes
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = usersList.filter(
      (user) =>
        user.username.toLowerCase().includes(lowercasedTerm) ||
        user.email.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, usersList]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users?role=Attendee");
      const data = await response.json();
      setUsersList(data.users); // Assuming API returns an array of users under 'users'
      setFilteredUsers(data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          location: "",
          date: "",
          attendees: [],
        });
        alert("Event created successfully!");
      }
    } catch (error) {
      alert("Error creating event");
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Select all users
      const allUserIds = filteredUsers.map((user) => user._id);
      setFormData({ ...formData, attendees: allUserIds });
    } else {
      // Deselect all users
      setFormData({ ...formData, attendees: [] });
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create New Event</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Event Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Search Attendees</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <div
                    className="border p-2 rounded"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {/* Select All Attendees Checkbox */}
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="selectAllAttendees"
                        onChange={handleSelectAll}
                        checked={filteredUsers.length > 0 && filteredUsers.every((user) => formData.attendees.includes(user._id))}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="selectAllAttendees"
                      >
                        Select All
                      </label>
                    </div>

                    {filteredUsers.map((user) => (
                      <div key={user._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={user._id}
                          checked={formData.attendees.includes(user._id)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...formData.attendees, user._id]
                              : formData.attendees.filter((a) => a !== user._id);
                            setFormData({ ...formData, attendees: updated });
                          }}
                        />
                        <label
                          style={{ color: "black" }}
                          className="form-check-label"
                          htmlFor={user._id}
                        >
                          {user.username} ({user.email})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Event"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
