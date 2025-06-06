import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MovieDetailsProps {
  movie: {
    id: number;
    title: string;
    overview: string;
    backdrop_path: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    genres?: { id: number; name: string }[];
    runtime?: number;
  };
  onBackPress: () => void;
}

const MovieDetails = ({ movie, onBackPress }: MovieDetailsProps) => {
  // Format minutes to hours and minutes
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format year from release date
  const getYear = (releaseDate?: string) => {
    if (!releaseDate) return "";
    return releaseDate.split("-")[0];
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          }}
          style={styles.backdropImage}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={onBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.headerGradient} />
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.posterContainer}>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.posterImage}
          />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.year}>{getYear(movie.release_date)}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.rating}>
              {movie.vote_average?.toFixed(1)}/10
            </Text>
          </View>

          {movie.genres && (
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreTag}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {movie.runtime && (
            <Text style={styles.runtime}>
              <Ionicons name="time-outline" size={16} color="#aaa" />{" "}
              {formatRuntime(movie.runtime)}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="play" size={22} color="white" />
          <Text style={styles.actionText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add" size={22} color="white" />
          <Text style={styles.actionText}>My List</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social" size={22} color="white" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overviewContainer}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overviewText}>{movie.overview}</Text>
      </View>

      <View style={styles.extraSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  headerContainer: {
    position: "relative",
    height: 220,
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "rgba(18, 18, 18, 0.8)",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: {
    flexDirection: "row",
    padding: 15,
    marginTop: -50,
  },
  posterContainer: {
    marginRight: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    paddingTop: 5,
  },
  title: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  year: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  genreTag: {
    backgroundColor: "#333",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: "white",
    fontSize: 12,
  },
  runtime: {
    color: "#aaa",
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginHorizontal: 15,
  },
  actionButton: {
    alignItems: "center",
  },
  actionText: {
    color: "white",
    marginTop: 5,
    fontSize: 14,
  },
  overviewContainer: {
    padding: 15,
  },
  overviewTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overviewText: {
    color: "#ccc",
    fontSize: 15,
    lineHeight: 22,
  },
  extraSpace: {
    height: 50,
  },
});

export default MovieDetails;
