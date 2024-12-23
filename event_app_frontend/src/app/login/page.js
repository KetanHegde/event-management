'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
    
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
    
      localStorage.setItem('authToken', data.token);
    
      setSuccess(true);
    
      // Redirect based on user role
      if (data.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" 
         style={{
           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
         }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg" 
                 style={{
                   borderRadius: '1rem',
                   backdropFilter: 'blur(10px)',
                   background: 'rgba(255, 255, 255, 0.95)'
                 }}>
              <div className="card-body p-5">
                <div className="mb-4 text-center">
                  <h2 className="fw-bold mb-2">Welcome Back</h2>
                  <p className="text-muted mb-4">Please enter your login details</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="email" className="form-label small fw-bold">Email address</label>
                    <input
                      type="email"
                      className="form-control form-control-lg bg-light border-2"
                      id="email"
                      placeholder="name@example.com"
                      style={{ borderRadius: '0.5rem' }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <label htmlFor="password" className="form-label small fw-bold">Password</label>
                      <a href="#" className="text-primary small text-decoration-none">Forgot password?</a>
                    </div>
                    <input
                      type="password"
                      className="form-control form-control-lg bg-light border-2"
                      id="password"
                      placeholder="Enter your password"
                      style={{ borderRadius: '0.5rem' }}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert" style={{ borderRadius: '0.5rem' }}>
                      <i className="bi bi-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success" role="alert" style={{ borderRadius: '0.5rem' }}>
                      <i className="bi bi-check-circle me-2"></i>
                      Successfully logged in!
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-3 mb-4 fw-bold"
                    style={{
                      borderRadius: '0.5rem',
                      background: 'linear-gradient(to right, #667eea, #764ba2)',
                      border: 'none'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-muted small mb-0">
                      Don't have an account? <a href="#" className="text-primary fw-bold text-decoration-none">Create account</a>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
