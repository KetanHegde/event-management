"use client";

import React, { useState } from "react";

const AttendeeForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      alert("Please fill in both username and email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password: "12345" }),
      });

      if (response.ok) {
        alert("Attendee registered successfully!");
        setUsername("");
        setEmail("");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to register attendee"}`);
      }
    } catch (error) {
      console.error("Error registering attendee:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f9f9f9" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Add New Attendee</h2>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username" style={{ display: "block", marginBottom: "5px", color: "#555" }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "5px", color: "#555" }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            required
          />
        </div>

        <button
        className="btn btn-outline-dark btn-block py-3 font-weight-bold"
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Registering..." : "Add Attendee"}
        </button>
      </form>
    </div>
  );
};

export default AttendeeForm;
