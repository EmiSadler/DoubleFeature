import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../../components/Footer";
import { DoubleFeatureLogo } from "../../components/DoubleFeatureLogo";
import { register } from "../../services/authentication";
import "./Authentication.css";
import "../../index.css";

export const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/login");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="sign-up-page">
        <h1 className="home-title">Welcome to</h1>
        <DoubleFeatureLogo />
        <h1>Sign Up for an Account to Start Playing!</h1>
        <form onSubmit={handleSubmit} method="post">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="username"
              required
              autoComplete="username"
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email"
              required
              autoComplete="email"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="password"
              required
              autoComplete="new-password"
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
          <div className="login-link">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};
