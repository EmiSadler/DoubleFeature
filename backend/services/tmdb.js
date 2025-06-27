const getRandomMovieLogic = async () => {
  const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB API key not found in environment variables");
  }

  const url =
    "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  const movies = [];

  for (let i = 1; i <= 10; i++) {
    const response = await fetch(`${url}${i}`, options);
    const data = await response.json();

    const moviesPartial = data.results;
    if (!moviesPartial || moviesPartial.length === 0) {
      throw new Error("No movies found on page " + i);
    }

    const englishMovies = moviesPartial.filter(
      (movie) => movie.original_language === "en"
    );
    movies.push(...englishMovies);
  }

  if (movies.length === 0) {
    throw new Error("No English movies found");
  }

  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];

  const { title, release_date, id, poster_path } = randomMovie; // Include poster_path

  return { title, release_date, id, poster_path };
};

const fetchMoviesByNameAndReleaseYear = async (movieName, movieReleaseYear) => {
  const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB API key not found in environment variables");
  }

  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    movieName
  )}&include_adult=false&language=en-US&page=1${
    movieReleaseYear ? `&year=${movieReleaseYear}` : ""
  }`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  try {
    console.log("Fetching movies with URL:", url);
    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(
        "TMDB API response not ok:",
        response.status,
        response.statusText
      );
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("TMDB API response:", {
      total_results: data.total_results,
      results_count: data.results?.length,
    });

    const movies = data.results;

    if (!movies || movies.length === 0) {
      console.log("No movies found for query:", movieName, movieReleaseYear);
      throw new Error("No movies found");
    }

    return movies; // Return the raw movie results
  } catch (err) {
    console.error("Error fetching movies by name:", err);
    if (err.message.includes("TMDB API key")) {
      throw err; // Re-throw API key errors as-is
    }
    throw new Error("Failed to fetch movies by name");
  }
};

/**
 * Fetches the cast from a movie ID
 * @param {number} movieId - The ID of the movie
 * @returns {Promise<Array>} - Array of cast members with name and id
 */
const fetchCastFromMovieId = async (movieId) => {
  const apiKey = process.env.TMDB_API_KEY || process.env.REACT_APP_API_KEY;

  if (!apiKey) {
    throw new Error("TMDB API key not found in environment variables");
  }

  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const cast = data.cast;

    if (!cast || cast.length === 0) {
      console.log(`No cast found for movie ID: ${movieId}`);
      return [];
    }

    // Extract only the name and id from each cast member
    return cast.map(({ name, id }) => ({ name, id }));
  } catch (err) {
    console.error(`Error fetching cast for movie ID ${movieId}:`, err);
    throw new Error("Failed to fetch cast data");
  }
};

module.exports = {
  getRandomMovieLogic,
  fetchMoviesByNameAndReleaseYear,
  fetchCastFromMovieId,
};
