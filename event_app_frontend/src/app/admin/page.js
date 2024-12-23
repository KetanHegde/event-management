'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminHomePage = () => {
  const router = useRouter();
  const [expanded, setExpanded] = useState({});

  const handleToggle = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h1 className="display-4 font-weight-bold">Admin Dashboard</h1>
        <p className="lead text-muted">Easily manage events, attendees, and tasks from here.</p>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-12">
          <div className="card shadow-lg border-light rounded">
            <div className="card-body">
              <h3 className="card-title text-center mb-4 font-weight-bold">Admin Actions</h3>
              <div className="row justify-content-center">
                {/* Create and Manage Events Button */}
                <div className="col-md-4 mb-4">
                  <button
                    onClick={() => handleToggle('events')}
                    className="btn btn-outline-dark btn-block py-3 font-weight-bold"
                  >
                    Create and Manage Events
                  </button>
                  <div
                    className={`collapse-menu ${expanded.events ? 'expanded' : ''}`}
                  >
                    <button
                      onClick={() => handleNavigation('/admin/create-event')}
                      className="btn btn-light btn-block py-2"
                    >
                      Create Event
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin/manage-event')}
                      className="btn btn-light btn-block py-2"
                    >
                      Manage Event
                    </button>
                  </div>
                </div>
                {/* Add and Manage Attendees Button */}
                <div className="col-md-4 mb-4">
                  <button
                    onClick={() => handleToggle('attendees')}
                    className="btn btn-outline-dark btn-block py-3 font-weight-bold"
                  >
                    Create and Manage Attendees
                  </button>
                  <div
                    className={`collapse-menu ${expanded.attendees ? 'expanded' : ''}`}
                  >
                    <button
                      onClick={() => handleNavigation('/admin/create-attendee')}
                      className="btn btn-light btn-block py-2"
                    >
                      Create Attendee
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin/manage-attendee')}
                      className="btn btn-light btn-block py-2"
                    >
                      Manage Attendee
                    </button>
                  </div>
                </div>
                {/* Create and Manage Tasks Button */}
                <div className="col-md-4 mb-4">
                  <button
                    onClick={() => handleToggle('tasks')}
                    className="btn btn-outline-dark btn-block py-3 font-weight-bold"
                  >
                    Create and Manage Tasks
                  </button>
                  <div
                    className={`collapse-menu ${expanded.tasks ? 'expanded' : ''}`}
                  >
                    <button
                      onClick={() => handleNavigation('/admin/create-task')}
                      className="btn btn-light btn-block py-2"
                    >
                      Create Task
                    </button>
                    <button
                      onClick={() => handleNavigation('/admin/manage-task')}
                      className="btn btn-light btn-block py-2"
                    >
                      Manage Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Styles for animations */}
      <style jsx>{`
        .collapse-menu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
          opacity: 0;
        }
        .collapse-menu.expanded {
          max-height: 150px; /* Adjust based on content height */
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default AdminHomePage;
