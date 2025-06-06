import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Movie, searchMovies } from "../services/movieService";
import MovieCard from "../components/MovieCard";

interface SearchScreenProps {
  onMovieSelect: (movie: Movie) => void;
}

const SearchScreen = ({ onMovieSelect }: SearchScreenProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      const searchResults = await searchMovies(query);
      setResults(searchResults);
      setLoading(false);
    } catch (error) {
      console.error("Error searching movies:", error);
      setResults([]);
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const renderSearchResults = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E50914" />
          <Text style={styles.messageText}>Searching...</Text>
        </View>
      );
    }

    if (hasSearched && results.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={50} color="#555" />
          <Text style={styles.messageText}>No movies found for "{query}"</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <MovieCard
            id={item.id}
            title={item.title}
            posterPath={item.poster_path}
            rating={item.vote_average}
            onPress={() => onMovieSelect(item)}
            style={styles.movieCard}
          />
        )}
        keyExtractor={(item) => `search-${item.id}`}
        numColumns={2}
        contentContainerStyle={styles.resultsContainer}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={24}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for movies..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={!query.trim()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {!hasSearched ? (
        <View style={styles.centerContainer}>
          <Ionicons name="tv-outline" size={60} color="#555" />
          <Text style={styles.instructionText}>
            Search for your favorite movies
          </Text>
        </View>
      ) : (
        renderSearchResults()
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    marginRight: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: "white",
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  instructionText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  messageText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 12,
    textAlign: "center",
  },
  resultsContainer: {
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    maxWidth: "50%",
  },
});

export default SearchScreen;
