"use client";

import React, { useState, useEffect } from "react";

const TaskForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    event: "",
  });
  const [eventsList, setEventsList] = useState([]); // Initialize as an empty array
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Apply filter when searchTerm changes, ensuring eventsList is an array
    const lowercasedTerm = searchTerm.toLowerCase();
    const filtered = (Array.isArray(eventsList) ? eventsList : []).filter(
      (event) =>
        event.name.toLowerCase().includes(lowercasedTerm) ||
        event.description.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredEvents(filtered);
  }, [searchTerm, eventsList]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const data = await response.json();
      setEventsList(data || []); 
      setFilteredEvents(data || []); 
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({
          name: "",
          deadline: "",
          event: "",
        });
        alert("Task created successfully!");
      }
    } catch (error) {
      alert("Error creating task");
    }
    setLoading(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Create New Task</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Task Name</label>
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
                  <label className="form-label">Deadline</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    required
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Search Event</label>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Search by event name or description..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <div
                    className="border p-2 rounded"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <div key={event._id} className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id={event._id}
                            name="event"
                            checked={formData.event === event._id}
                            onChange={() =>
                              setFormData({ ...formData, event: event._id })
                            }
                          />
                          <label
                            style={{ color: "black" }}
                            className="form-check-label"
                            htmlFor={event._id}
                          >
                            {event.name} ({event.description})
                          </label>
                        </div>
                      ))
                    ) : (
                      <p>No events found</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark w-100"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Task"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
