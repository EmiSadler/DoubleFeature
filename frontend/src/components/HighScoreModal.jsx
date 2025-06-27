import React, { useState, useEffect } from "react";
import "../css/HighScoreModal.css";

const HighScoreModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // 'personal' or 'global'
  const [personalScores, setPersonalScores] = useState([]);
  const [globalScores, setGlobalScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get backend URL from environment variable
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  console.log("HighScoreModal API URL:", API); // Debug logging

  // Fetch scores when the modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchScores();
    }
  }, [isModalOpen]);

  const fetchScores = async () => {
    setIsLoading(true);

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");

      if (token) {
        // Fetch personal scores
        const personalResponse = await fetch(`${API}/scores/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (personalResponse.ok) {
          const personalData = await personalResponse.json();
          setPersonalScores(personalData);
        } else {
          console.error(
            "Failed to fetch personal scores:",
            personalResponse.status
          );
        }
      }

      // Fetch global scores (no auth needed)
      const globalResponse = await fetch(`${API}/scores/leaderboard`);

      if (globalResponse.ok) {
        const globalData = await globalResponse.json();
        setGlobalScores(globalData);
      } else {
        console.error("Failed to fetch global scores:", globalResponse.status);
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
      // Set empty arrays if there's an error
      setPersonalScores([]);
      setGlobalScores([]);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format scores for display, taking only top 10
  const displayScores =
    activeTab === "personal"
      ? personalScores.slice(0, 10)
      : globalScores.slice(0, 10);

  return (
    <div>
      <button className="modal-howto-btn" onClick={openModal}>
        Highscores
      </button>

      {isModalOpen && (
        <div className="modal-highscores-overlay open-modal-highscores">
          <div className="modal-highscores-container">
            <h1 className="highscores-h1">Highscores</h1>

            <div className="highscores-tabs">
              <button
                className={`tab-btn ${
                  activeTab === "personal" ? "active" : ""
                }`}
                onClick={() => setActiveTab("personal")}
              >
                Your Highscores
              </button>
              <button
                className={`tab-btn ${activeTab === "global" ? "active" : ""}`}
                onClick={() => setActiveTab("global")}
              >
                Global Leaderboard
              </button>
            </div>

            <div className="highscores-content">
              {isLoading ? (
                <div className="loading-spinner">Loading...</div>
              ) : (
                <>
                  {activeTab === "personal" &&
                  !localStorage.getItem("token") ? (
                    <div className="login-prompt">
                      Please <a href="/login">log in</a> to view your highscores
                    </div>
                  ) : displayScores.length === 0 ? (
                    <div className="no-scores-message">
                      {activeTab === "personal"
                        ? "You haven't played any games yet!"
                        : "No highscores recorded yet"}
                    </div>
                  ) : (
                    <table className="highscores-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Player</th>
                          <th>Score</th>
                          <th>Mode</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayScores.map((score, index) => (
                          <tr
                            key={index}
                            className={index < 3 ? "top-rank" : ""}
                          >
                            <td>#{index + 1}</td>
                            <td>
                              {activeTab === "personal"
                                ? "You"
                                : score.user.username}
                            </td>
                            <td>{score.score}</td>
                            <td
                              className={
                                score.gameMode === "hard"
                                  ? "hard-mode"
                                  : "easy-mode"
                              }
                            >
                              {score.gameMode.charAt(0).toUpperCase() +
                                score.gameMode.slice(1)}
                            </td>
                            <td>{formatDate(score.playedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>

            <button className="close-highscores-btn" onClick={closeModal}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HighScoreModal;
