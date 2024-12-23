"use client";
import { useState, useEffect } from "react";

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState([]); // Store selected attendee IDs
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetching events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventResponse = await fetch("http://localhost:5000/api/events");
      if (!eventResponse.ok) {
        throw new Error("Failed to fetch events");
      }
      const eventData = await eventResponse.json();
      setEvents(Array.isArray(eventData) ? eventData : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendees for a specific event
  const fetchAttendeesForEvent = async (eventId) => {
    try {
      const attendeeResponse = await fetch(`http://localhost:5000/api/attendees/event/${eventId}`);
      if (!attendeeResponse.ok) {
        throw new Error("Failed to fetch attendees");
      }
      const attendeeData = await attendeeResponse.json();
      setAttendees(attendeeData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Add selected attendees to the event
  const addAttendees = async (eventId) => {
    if (selectedAttendeeIds.length === 0) {
      alert("Please select at least one attendee.");
      return;
    }
    try {
      const response = await fetch(`/api/attendees/${eventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attendeeIds: selectedAttendeeIds }), // Sending multiple IDs
      });

      if (!response.ok) {
        throw new Error("Failed to add attendees");
      }

      const data = await response.json();
      alert(data.message);
      fetchAttendeesForEvent(eventId); // Refresh attendees list
      setSelectedAttendeeIds([]); // Reset selected attendee IDs
    } catch (err) {
      alert("Error adding attendees: " + err.message);
    }
  };

  // Delete event
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

  // Delete attendee from an event
  const deleteAttendee = async (eventId, attendeeId) => {
    try {
      await fetch(`http://localhost:5000/api/attendees/${eventId}/${attendeeId}`, {
        method: 'DELETE'
      });
      fetchAttendeesForEvent(eventId); // Refresh attendees list
    } catch (err) {
      alert("Error deleting attendee: " + err.message);
    }
  };

  // Filter attendees by search term (email or username)
  const filteredAttendees = attendees.filter(attendee =>
    (attendee.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
    (attendee.username?.toLowerCase().includes(searchTerm.toLowerCase()) || "")
  );

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle checkbox change (for selecting attendees)
  const handleSelectAttendee = (attendeeId, isSelected) => {
    setSelectedAttendeeIds(prevIds =>
      isSelected ? [...prevIds, attendeeId] : prevIds.filter(id => id !== attendeeId)
    );
  };

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
      <h1 className="mb-4 text-center">Event and Attendee Management</h1>

      {/* Event Table */}
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
                  onClick={() => {
                    setEditingEvent(event);
                    fetchAttendeesForEvent(event._id); // Fetch attendees for the selected event
                  }}
                >
                  View Attendees
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Attendees Section (Visible after selecting an event) */}
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

          {/* Add attendees to event */}
          <button
            className="btn btn-primary mb-3"
            onClick={() => addAttendees(editingEvent._id)}
          >
            Add Selected Attendees
          </button>

          {/* Attendees Table */}
          <div className="border p-2 rounded" style={{ maxHeight: "200px", overflowY: "auto" }}>
            {filteredAttendees.map((attendee) => (
              <div key={attendee._id} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={attendee._id}
                  checked={selectedAttendeeIds.includes(attendee._id)}
                  onChange={(e) => handleSelectAttendee(attendee._id, e.target.checked)}
                />
                <label className="form-check-label" htmlFor={attendee._id}>
                  {attendee.username} ({attendee.email})
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagementPage;
