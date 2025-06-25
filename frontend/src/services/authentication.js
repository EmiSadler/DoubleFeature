const API_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

// Auth service for new user registration
export const register = async (username, email, password) => {
  const response = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Registration failed");
  }

  return response.json();
};

// Auth service for user login
export const login = async (usernameOrEmail, password) => {
  const response = await fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  return response.json(); // { token, user }
};

// Auth service to get user profile
export const getProfile = async (token) => {
  const response = await fetch(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
};
