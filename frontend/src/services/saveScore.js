// saving game scores
export const saveGameScore = async (token, score, gameMode, moviesUsed) => {
  const response = await fetch(`${DATABASE_URL}/scores`, {
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
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to save score");
  }

  return response.json();
};

// get user's scores
export const getUserScores = async (token) => {
  const response = await fetch(`${DATABASE_URL}/scores/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch scores");
  }

  return response.json();
};
