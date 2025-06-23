import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/WelcomeMessage.css";

const WelcomeMessage = () => {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Check if user is logged in by looking for token and user info
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (token && userString) {
      try {
        const user = JSON.parse(userString);
        setUsername(user.username);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  return (
    <div className="welcome-message">
      {username ? (
        <div className="user-welcome">
          <h2>
            Hello, <span className="username-highlight">{username}</span>!
          </h2>
          <p>Your high scores are being saved.</p>
        </div>
      ) : (
        <div className="sign-in-prompt">
          <p>
            <Link to="/signup" className="welcome-link">
              Sign up
            </Link>{" "}
            or{" "}
            <Link to="/login" className="welcome-link">
              log in
            </Link>{" "}
            to save your high scores!
          </p>
        </div>
      )}
    </div>
  );
};

export default WelcomeMessage;
