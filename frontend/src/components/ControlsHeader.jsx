import React from "react";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";
import NavigationButton from "./NavigationButton";
import WelcomeMessage from "./WelcomeMessage";
import GameModeIndicator from "./GameModeIndicator";
import "../css/Header.css";

const ControlsHeader = ({ gameMode }) => {
  // Check if user is logged in by looking for token
  const isLoggedIn = localStorage.getItem("token") !== null;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Refresh the page to update UI
    window.location.reload();
  };

  return (
    <div className="controls-header-container">
      <div className="controls-top-section">
        <div className="navigation-buttons">
          {!isLoggedIn ? (
            <>
              <NavigationButton to="/signup" label="Sign Up" />
              <NavigationButton to="/login" label="Login" />
            </>
          ) : (
            <NavigationButton onClick={handleLogout} label="Logout" />
          )}
        </div>

        <div className="toggles-container">
          <ThemeToggle />
          <SoundToggle />
        </div>
      </div>

      <div className="controls-bottom-section">
        <WelcomeMessage />
      </div>
      <div className="game-mode-indicator-container">
        {gameMode && <GameModeIndicator gameMode={gameMode} />}
      </div>
    </div>
  );
};

export default ControlsHeader;
