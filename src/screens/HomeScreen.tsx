import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import {
  Movie,
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from "../services/movieService";
import MovieCard from "../components/MovieCard";

interface HomeScreenProps {
  onMovieSelect: (movie: Movie) => void;
}

const HomeScreen = ({ onMovieSelect }: HomeScreenProps) => {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all movie data in parallel
        const [trending, popular, topRated] = await Promise.all([
          getTrendingMovies(),
          getPopularMovies(),
          getTopRatedMovies(),
        ]);

        setTrendingMovies(trending);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);

        // Set a random trending movie as featured
        if (trending.length > 0) {
          const randomIndex = Math.floor(Math.random() * trending.length);
          setFeaturedMovie(trending[randomIndex]);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error loading home screen data:", err);
        setError("Failed to load movies. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render a row of movies
  const renderMovieRow = (
    title: string,
    movies: Movie[],
    emptyMessage: string = "No movies available"
  ) => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {movies.length > 0 ? (
          <FlatList
            data={movies}
            renderItem={({ item }) => (
              <MovieCard
                id={item.id}
                title={item.title}
                posterPath={item.poster_path}
                rating={item.vote_average}
                onPress={() => onMovieSelect(item)}
              />
            )}
            keyExtractor={(item) => `${title}-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.movieList}
          />
        ) : (
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        )}
      </View>
    );
  };

  // Featured movie banner
  const renderFeaturedMovie = () => {
    if (!featuredMovie) return null;

    return (
      <ImageBackground
        source={{
          uri: `https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`,
        }}
        style={styles.featuredContainer}
      >
        <View style={styles.featuredGradient}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
            <Text style={styles.featuredOverview} numberOfLines={3}>
              {featuredMovie.overview}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {renderFeaturedMovie()}

      {renderMovieRow("Trending Now", trendingMovies)}
      {renderMovieRow("Popular Movies", popularMovies)}
      {renderMovieRow("Top Rated", topRatedMovies)}

      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    color: "white",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  errorText: {
    color: "white",
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  movieList: {
    paddingHorizontal: 8,
  },
  emptyText: {
    color: "#aaa",
    padding: 16,
    fontStyle: "italic",
  },
  featuredContainer: {
    height: 300,
    width: "100%",
    marginBottom: 16,
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredOverview: {
    color: "#ddd",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    height: 40,
  },
});

export default HomeScreen;
