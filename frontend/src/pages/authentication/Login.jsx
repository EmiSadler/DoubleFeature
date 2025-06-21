import React, { useState } from "react";
import Footer from "../../components/Footer";
import { DoubleFeatureLogo } from "../../components/DoubleFeatureLogo";
import "./Authentication.css";
import "../../index.css";

export const Login = () => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt with:", formData);
  };

  return (
    <div className="page-container">
      <div className="sign-up-page">
        <h1 className="home-title">Welcome to</h1>
        <DoubleFeatureLogo />
        <h1>Login to Start Playing!</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
          <div className="login-link">
            Need an Account? <a href="/signup">Sign Up Here</a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};
