import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import Footer from "../../components/Footer";
import { DoubleFeatureLogo } from "../../components/DoubleFeatureLogo";
import { login } from "../../services/authentication";
import "./Authentication.css";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
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
      const data = await login(formData.usernameOrEmail, formData.password);

      // Store token and user info in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to home page after successful login
      navigate("/");
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
        <h1>Login to Start Playing!</h1>
        <form onSubmit={handleSubmit} method="post">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="usernameOrEmail">Username or Email</label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleInputChange}
              placeholder="Enter your username or email"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="login-link">
            Need an Account? <Link to="/signup">Sign Up Here</Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};
