import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  onPress: () => void;
  style?: object;
  focused?: boolean;
}

const MovieCard = ({
  title,
  posterPath,
  rating,
  onPress,
  style,
  focused = false,
}: MovieCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, focused ? styles.focused : null, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${posterPath}`,
        }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.rating}>
          <Ionicons name="star" size={14} color="#FFD700" /> {rating.toFixed(1)}
        </Text>
      </View>

      {focused && (
        <View style={styles.focusOverlay}>
          <Ionicons name="play-circle" size={50} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginHorizontal: 8,
    marginVertical: 10,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
  },
  focused: {
    transform: [{ scale: 1.05 }],
    borderWidth: 2,
    borderColor: "#E50914",
  },
  poster: {
    width: "100%",
    height: 225,
    backgroundColor: "#2c2c2c",
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  rating: {
    color: "#aaa",
    fontSize: 12,
  },
  focusOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MovieCard;
