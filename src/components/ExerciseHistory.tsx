import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Mock exercise history data
const mockExerciseHistory = [
  {
    id: "1",
    type: "RUNNING",
    date: "2024-01-15",
    duration: "30:14",
    calories: 320,
    distance: 4.2,
    heartRate: 142,
  },
  {
    id: "2",
    type: "WALKING",
    date: "2024-01-13",
    duration: "45:30",
    calories: 220,
    distance: 3.6,
    heartRate: 110,
  },
  {
    id: "3",
    type: "BIKING",
    date: "2024-01-10",
    duration: "55:45",
    calories: 450,
    distance: 12.3,
    heartRate: 135,
  },
];

// Exercise type to icon mapping
const exerciseIcons: Record<string, string> = {
  RUNNING: "walk",
  WALKING: "footsteps",
  BIKING: "bicycle",
  WORKOUT: "barbell",
  SWIMMING: "water",
};

const ExerciseHistory: React.FC = () => {
  const renderExerciseItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.exerciseItem}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={(exerciseIcons[item.type] as any) || "fitness"}
          size={28}
          color="#4a90e2"
        />
      </View>

      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseType}>{item.type}</Text>
        <Text style={styles.exerciseDate}>{item.date}</Text>

        <View style={styles.exerciseMetrics}>
          <View style={styles.metricItem}>
            <Ionicons name="time" size={14} color="#666" />
            <Text style={styles.metricText}>{item.duration}</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="flame" size={14} color="#FF9F1C" />
            <Text style={styles.metricText}>{item.calories} cal</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="trending-up" size={14} color="#4EADEA" />
            <Text style={styles.metricText}>{item.distance} km</Text>
          </View>

          <View style={styles.metricItem}>
            <Ionicons name="heart" size={14} color="#FF5B5B" />
            <Text style={styles.metricText}>{item.heartRate} bpm</Text>
          </View>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercise History</Text>
      </View>

      {mockExerciseHistory.length > 0 ? (
        <FlatList
          data={mockExerciseHistory}
          renderItem={renderExerciseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="fitness" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No exercise history yet.</Text>
          <Text style={styles.emptySubText}>
            Start your first workout to track your progress!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#333",
    padding: 15,
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  exerciseItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f8ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  exerciseDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  exerciseMetrics: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  metricText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
});

export default ExerciseHistory;
