const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// saving game scores
export const saveGameScore = async (token, score, gameMode, moviesUsed) => {
  const response = await fetch(`${API}/scores`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score,
      gameMode,
      moviesUsed,
    }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to save score";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (parseError) {
      // If we can't parse JSON, it's likely an HTML error page
      console.error("Received non-JSON response:", parseError);
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// get user's scores
export const getUserScores = async (token) => {
  const response = await fetch(`${API}/scores/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    let errorMessage = "Failed to fetch scores";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (parseError) {
      console.error("Received non-JSON response:", parseError);
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// get global leaderboard
export const getLeaderboard = async () => {
  const response = await fetch(`${API}/scores/leaderboard`);

  if (!response.ok) {
    let errorMessage = "Failed to fetch leaderboard";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch (parseError) {
      console.error("Received non-JSON response:", parseError);
      errorMessage = `Server error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};
