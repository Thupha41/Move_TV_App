import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HealthTracker from "./src/components/HealthTracker";
import ExerciseHistory from "./src/components/ExerciseHistory";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "dictionary" | "health" | "history"
  >("health");

  // Render different components based on the selected tab
  const renderScreen = () => {
    switch (currentScreen) {
      case "dictionary":
        return <Text style={styles.placeholderText}>Dictionary Screen</Text>;
      case "health":
        return <HealthTracker />;
      case "history":
        return <ExerciseHistory />;
      default:
        return <HealthTracker />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderScreen()}

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === "dictionary" && styles.activeTab,
          ]}
          onPress={() => setCurrentScreen("dictionary")}
        >
          <Ionicons
            name="book"
            size={22}
            color={currentScreen === "dictionary" ? "#4a90e2" : "#888"}
          />
          <Text style={styles.tabText}>Dictionary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === "health" && styles.activeTab,
          ]}
          onPress={() => setCurrentScreen("health")}
        >
          <Ionicons
            name="fitness"
            size={22}
            color={currentScreen === "health" ? "#4a90e2" : "#888"}
          />
          <Text style={styles.tabText}>Workout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            currentScreen === "history" && styles.activeTab,
          ]}
          onPress={() => setCurrentScreen("history")}
        >
          <Ionicons
            name="list"
            size={22}
            color={currentScreen === "history" ? "#4a90e2" : "#888"}
          />
          <Text style={styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#e0e0e0",
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    color: "#333",
  },
  placeholderText: {
    flex: 1,
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
