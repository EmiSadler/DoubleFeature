import React, { useState, useEffect } from "react";
import "../css/HighScoreModal.css";

const HighScoreModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'easy', 'hard', or 'combined'
  const [personalScores, setPersonalScores] = useState([]);
  const [easyScores, setEasyScores] = useState([]);
  const [hardScores, setHardScores] = useState([]);
  const [combinedScores, setCombinedScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get backend URL from environment variable
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

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

      // Fetch easy mode scores
      const easyResponse = await fetch(
        `${API}/scores/leaderboard?gameMode=easy&limit=50`
      );
      if (easyResponse.ok) {
        const easyData = await easyResponse.json();
        setEasyScores(easyData);
      } else {
        console.error("Failed to fetch easy scores:", easyResponse.status);
      }

      // Fetch hard mode scores
      const hardResponse = await fetch(
        `${API}/scores/leaderboard?gameMode=hard&limit=50`
      );
      if (hardResponse.ok) {
        const hardData = await hardResponse.json();
        setHardScores(hardData);
      } else {
        console.error("Failed to fetch hard scores:", hardResponse.status);
      }

      // Fetch all scores for combined leaderboard
      const combinedResponse = await fetch(`${API}/scores/all`);
      if (combinedResponse.ok) {
        const combinedData = await combinedResponse.json();
        // Sort by score descending, then by date ascending
        const sortedCombined = combinedData
          .sort((a, b) => {
            if (b.score === a.score) {
              return new Date(a.playedAt) - new Date(b.playedAt);
            }
            return b.score - a.score;
          })
          .slice(0, 50);
        setCombinedScores(sortedCombined);
      } else {
        console.error(
          "Failed to fetch combined scores:",
          combinedResponse.status
        );
      }
    } catch (error) {
      console.error("Error fetching scores:", error);
      // Set empty arrays if there's an error
      setPersonalScores([]);
      setEasyScores([]);
      setHardScores([]);
      setCombinedScores([]);
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
  const getDisplayScores = () => {
    switch (activeTab) {
      case "personal":
        return personalScores.slice(0, 10);
      case "easy":
        return easyScores.slice(0, 10);
      case "hard":
        return hardScores.slice(0, 10);
      case "combined":
        return combinedScores.slice(0, 10);
      default:
        return [];
    }
  };

  const displayScores = getDisplayScores();

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
                Your Scores
              </button>
              <button
                className={`tab-btn ${activeTab === "easy" ? "active" : ""}`}
                onClick={() => setActiveTab("easy")}
              >
                Easy Mode
              </button>
              <button
                className={`tab-btn ${activeTab === "hard" ? "active" : ""}`}
                onClick={() => setActiveTab("hard")}
              >
                Hard Mode
              </button>
              <button
                className={`tab-btn ${
                  activeTab === "combined" ? "active" : ""
                }`}
                onClick={() => setActiveTab("combined")}
              >
                Combined
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
                      Please <a href="/login">log in</a> to view your scores
                    </div>
                  ) : displayScores.length === 0 ? (
                    <div className="no-scores-message">
                      {activeTab === "personal"
                        ? "You haven't played any games yet!"
                        : `No ${
                            activeTab === "combined" ? "" : activeTab + " mode "
                          }scores recorded yet`}
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
                            key={`${score.id}-${index}`}
                            className={index < 3 ? "top-rank" : ""}
                          >
                            <td>#{index + 1}</td>
                            <td>
                              {activeTab === "personal"
                                ? "You"
                                : score.user?.username || "Unknown"}
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
