import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import MovieDetails from "./src/components/MovieDetails";

// Movie interface
interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "search" | "details"
  >("home");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setCurrentScreen("details");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setSelectedMovie(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onMovieSelect={handleMovieSelect} />;
      case "search":
        return <SearchScreen onMovieSelect={handleMovieSelect} />;
      case "details":
        return selectedMovie ? (
          <MovieDetails movie={selectedMovie} onBackPress={handleBackToHome} />
        ) : (
          <HomeScreen onMovieSelect={handleMovieSelect} />
        );
      default:
        return <HomeScreen onMovieSelect={handleMovieSelect} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {currentScreen !== "details" && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MovieFlix</Text>
        </View>
      )}

      {renderScreen()}

      {currentScreen !== "details" && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              currentScreen === "home" && styles.activeTab,
            ]}
            onPress={() => setCurrentScreen("home")}
          >
            <Ionicons
              name="home"
              size={24}
              color={currentScreen === "home" ? "#E50914" : "#888"}
            />
            <Text style={styles.tabText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              currentScreen === "search" && styles.activeTab,
            ]}
            onPress={() => setCurrentScreen("search")}
          >
            <Ionicons
              name="search"
              size={24}
              color={currentScreen === "search" ? "#E50914" : "#888"}
            />
            <Text style={styles.tabText}>Search</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 15,
    backgroundColor: "#1a1a1a",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerTitle: {
    color: "#E50914",
    fontSize: 22,
    fontWeight: "bold",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderColor: "#333",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderTopWidth: 3,
    borderColor: "#E50914",
  },
  tabText: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 2,
  },
});
