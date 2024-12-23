"use client";

import { useState, useEffect } from "react";

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttendees, setSelectedAttendees] = useState([]); 
  const [usersList, setUsersList] = useState([]);

  // Fetching functions remain the same
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventResponse = await fetch("http://localhost:5000/api/events");
      if (!eventResponse.ok) throw new Error("Failed to fetch events");
      const eventData = await eventResponse.json();
      setEvents(Array.isArray(eventData) ? eventData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendeesForEvent = async (eventId) => {
    try {
      const attendeeResponse = await fetch(`http://localhost:5000/api/attendees/event/${eventId}`);
      if (!attendeeResponse.ok) throw new Error("Failed to fetch attendees");
      const attendeeData = await attendeeResponse.json();
      setAttendees(attendeeData);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async (eventId) => {
    try {
      const response = await fetch("http://localhost:5000/api/users?role=Attendee");
      const data = await response.json();
      const eventAttendeesResponse = await fetch(`http://localhost:5000/api/attendees/event/${eventId}`);
      const eventAttendeesData = await eventAttendeesResponse.json();
      const eventAttendeesIds = eventAttendeesData.map(attendee => attendee._id);
      const availableUsers = data.users.filter(user => !eventAttendeesIds.includes(user._id));
      setUsersList(availableUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const addAttendees = async (eventId) => {
    if (selectedAttendees.length === 0) {
      alert("Please select at least one attendee.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/attendees/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attendeeIds: selectedAttendees }),
      });

      if (!response.ok) throw new Error("Failed to add attendees");

      await response.json();
      fetchAttendeesForEvent(eventId);
      setSelectedAttendees([]);
      alert("Attendees added successfully!");
    } catch (err) {
      alert("Error adding attendees: " + err.message);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await fetch(`http://localhost:5000/api/events/${eventId}`, {
        method: 'DELETE'
      });
      setEvents(events.filter(event => event._id !== eventId));
    } catch (err) {
      alert("Error deleting event: " + err.message);
    }
  };

  const deleteAttendee = async (eventId, attendeeId) => {
    try {
      await fetch(`http://localhost:5000/api/attendees/${eventId}/${attendeeId}`, {
        method: 'DELETE'
      });
      fetchAttendeesForEvent(eventId);
    } catch (err) {
      alert("Error deleting attendee: " + err.message);
    }
  };

  const toggleAttendee = (userId) => {
    setSelectedAttendees(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleAllAttendees = () => {
    const filteredUsers = usersList.filter(user => 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (selectedAttendees.length === filteredUsers.length) {
      setSelectedAttendees([]);
    } else {
      setSelectedAttendees(filteredUsers.map(user => user._id));
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (editingEvent) {
      fetchUsers(editingEvent._id);
      fetchAttendeesForEvent(editingEvent._id);
    }
  }, [editingEvent]);

  const filteredAttendees = attendees.filter(attendee => 
    (attendee.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (attendee.username?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
  );

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
      <h1 className="mb-4 text-center">Event and Attendee Management</h1>

      <h3>Events</h3>
      <table className="table table-striped table-hover">
        <thead className="table-dark sticky-top">
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.name}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-dark btn-sm me-2"
                  onClick={() => deleteEvent(event._id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setEditingEvent(event)}
                >
                  View Attendees
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingEvent && (
        <div>
          <h3>Attendees for {editingEvent.name}</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search attendees by email or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2">
              <button
                className="btn btn-secondary mb-2"
                onClick={toggleAllAttendees}
              >
                {selectedAttendees.length === usersList.filter(user => 
                  user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  user.username?.toLowerCase().includes(searchTerm.toLowerCase())
                ).length ? 'Deselect All' : 'Select All'}
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
                      checked={selectedAttendees.includes(user._id)}
                      onChange={() => toggleAttendee(user._id)}
                    />
                    <label className="form-check-label" htmlFor={user._id}>
                      {user.username} ({user.email})
                    </label>
                  </div>
                ))}
            </div>
            <button
              className="btn btn-primary mb-3"
              onClick={() => addAttendees(editingEvent._id)}
              disabled={selectedAttendees.length === 0}
            >
              Add Selected Attendees
            </button>
          </div>

          <table className="table table-striped table-hover">
            <thead className="table-dark sticky-top">
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee) => (
                  <tr key={attendee._id}>
                    <td>{attendee.email}</td>
                    <td>{attendee.username}</td>
                    <td>
                      <button
                        className="btn btn-dark btn-sm me-2"
                        onClick={() => deleteAttendee(editingEvent._id, attendee._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    No attendees found
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

export default EventManagementPage;