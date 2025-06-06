import axios from "axios";

// Replace with your actual API key from TheMovieDB
const API_KEY = "479fa3e47474412e75ff2eec3c5ab3ef";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Movie interfaces
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

// Get trending movies
export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Get popular movies
export const getPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }
};

// Get top rated movies
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return [];
  }
};

// Get movie details
export const getMovieDetails = async (
  movieId: number
): Promise<MovieDetails | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for movie id ${movieId}:`, error);
    return null;
  }
};

// Search movies
export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return [];
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number): Promise<Movie[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies for genre id ${genreId}:`, error);
    return [];
  }
};

// Get movie genres
export const getMovieGenres = async (): Promise<
  { id: number; name: string }[]
> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching movie genres:", error);
    return [];
  }
};

// Helper function to get full image URL
export const getImageUrl = (
  path: string | null,
  size: string = "w500"
): string => {
  if (!path) return "";
  return `${IMAGE_BASE_URL}/${size}${path}`;
};
