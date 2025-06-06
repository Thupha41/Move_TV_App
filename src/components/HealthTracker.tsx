import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as HealthServices from "../utils/healthServices";

// Get screen dimensions
const windowWidth = Dimensions.get("window").width;
const watchSize = Math.min(windowWidth - 40, 360); // Limiting max size for larger screens

// Types for health metrics
type HealthMetrics = {
  heartRate: number;
  calories: number;
  distance: number | null;
  steps: number | null;
};

const HealthTracker: React.FC = () => {
  // State variables
  const [isExercising, setIsExercising] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [metrics, setMetrics] = useState<HealthMetrics>({
    heartRate: 0,
    calories: 0,
    distance: null,
    steps: null,
  });
  const [loading, setLoading] = useState(false);
  const [exerciseType, setExerciseType] =
    useState<HealthServices.ExerciseType>("RUNNING");
  const [serviceAvailable, setServiceAvailable] = useState<boolean | null>(
    null
  );

  // Check if Health Services are available
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const isAvailable = await HealthServices.isHealthServicesAvailable();
        setServiceAvailable(isAvailable);

        if (!isAvailable) {
          Alert.alert(
            "Not Available",
            "Health Services are not available on this device"
          );
        }
      } catch (error) {
        console.error("Error checking Health Services availability:", error);
        setServiceAvailable(false);
      }
    };

    checkAvailability();
  }, []);

  // Effect to update metrics during exercise
  useEffect(() => {
    if (isExercising && !isPaused) {
      const metricsInterval = setInterval(async () => {
        try {
          const updatedMetrics = await HealthServices.updateExerciseMetrics();

          if (updatedMetrics) {
            setMetrics((prev) => ({
              heartRate: updatedMetrics["HEART_RATE_BPM"],
              calories: updatedMetrics["CALORIES"],
              distance: updatedMetrics["DISTANCE"],
              steps: updatedMetrics["STEPS"],
            }));
          }
        } catch (error) {
          console.error("Error updating metrics:", error);
        }
      }, 2000);

      return () => clearInterval(metricsInterval);
    }
  }, [isExercising, isPaused]);

  // Effect to manage timer
  useEffect(() => {
    if (isExercising && !isPaused) {
      const interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);

      return () => clearInterval(interval);
    } else if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [isExercising, isPaused]);

  // Start exercise tracking
  const startExercise = async () => {
    setLoading(true);

    try {
      await HealthServices.startExerciseSession(exerciseType);
      setIsExercising(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error starting exercise:", error);
      Alert.alert("Error", "Failed to start exercise session");
    } finally {
      setLoading(false);
    }
  };

  // Pause exercise tracking
  const pauseExercise = async () => {
    try {
      await HealthServices.pauseExerciseSession();
      setIsPaused(true);
    } catch (error) {
      console.error("Error pausing exercise:", error);
    }
  };

  // Resume exercise tracking
  const resumeExercise = async () => {
    try {
      await HealthServices.resumeExerciseSession();
      setIsPaused(false);
    } catch (error) {
      console.error("Error resuming exercise:", error);
    }
  };

  // End exercise tracking
  const endExercise = async () => {
    try {
      const session = await HealthServices.endExerciseSession();
      setIsExercising(false);
      setIsPaused(false);
      setTimer(0);
      setMetrics({
        heartRate: 0,
        calories: 0,
        distance: null,
        steps: null,
      });

      if (session) {
        Alert.alert(
          "Exercise Summary",
          `Duration: ${formatTime(Math.floor(session.duration / 1000))}\n` +
            `Heart Rate: ${session.metrics["HEART_RATE_BPM"]} bpm\n` +
            `Calories: ${session.metrics["CALORIES"].toFixed(1)} cal\n` +
            `Distance: ${session.metrics["DISTANCE"].toFixed(2)} km`
        );
      }
    } catch (error) {
      console.error("Error ending exercise:", error);
    }
  };

  // Format timer to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // If service availability is still being checked
  if (serviceAvailable === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9F1C" />
        <Text style={styles.loadingText}>Checking Health Services...</Text>
      </View>
    );
  }

  // If Health Services are not available
  if (serviceAvailable === false) {
    return (
      <View style={styles.notAvailableContainer}>
        <View style={styles.watchFace}>
          <Ionicons name="alert-circle" size={48} color="#808080" />
          <Text style={styles.notAvailableText}>
            Exercise not available on this device
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.watchContainer}>
        <View style={styles.watchFace}>
          {/* Top section with timer */}
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
          </View>

          {/* Middle section with metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Ionicons name="heart" size={24} color="#FF5B5B" />
                <Text style={styles.metricValue}>
                  {Math.round(metrics.heartRate)}
                </Text>
              </View>

              <Text style={styles.metricSeparator}>—</Text>

              <View style={styles.metricItem}>
                <Ionicons name="flame" size={24} color="#FF9F1C" />
                <Text style={styles.metricValue}>
                  {metrics.calories.toFixed(1)}
                </Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                <Ionicons name="trending-up" size={24} color="#4EADEA" />
                <Text style={styles.metricValue}>
                  {metrics.distance ? metrics.distance.toFixed(2) : "—"}
                </Text>
              </View>

              <Text style={styles.metricSeparator}>—</Text>

              <View style={styles.metricItem}>
                <Ionicons name="footsteps" size={24} color="#4CD964" />
                <Text style={styles.metricValue}>
                  {metrics.steps ? Math.round(metrics.steps) : "—"}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom section with controls */}
          <View style={styles.controlsContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#FF9F1C" />
            ) : isExercising ? (
              isPaused ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.endButton}
                    onPress={endExercise}
                  >
                    <Text style={styles.buttonText}>END</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.resumeButton}
                    onPress={resumeExercise}
                  >
                    <Text style={styles.buttonText}>RESUME</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.endButton}
                    onPress={endExercise}
                  >
                    <Text style={styles.buttonText}>END</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.pauseButton}
                    onPress={pauseExercise}
                  >
                    <Text style={styles.buttonText}>PAUSE</Text>
                  </TouchableOpacity>
                </View>
              )
            ) : (
              <TouchableOpacity
                style={styles.startButton}
                onPress={startExercise}
              >
                <Text style={styles.buttonText}>START</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  watchContainer: {
    width: watchSize,
    height: watchSize,
    borderRadius: watchSize / 2,
    backgroundColor: "#333",
    padding: 4,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  watchFace: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: watchSize / 2 - 4,
    padding: 15,
    justifyContent: "space-between",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    color: "#333",
    marginTop: 10,
  },
  notAvailableContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  notAvailableText: {
    color: "white",
    textAlign: "center",
    marginTop: 10,
    fontSize: 16,
  },
  timerContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  timerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
  },
  metricsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
  },
  metricItem: {
    alignItems: "center",
  },
  metricValue: {
    color: "white",
    fontSize: 16,
    marginTop: 4,
  },
  metricSeparator: {
    color: "#555",
    fontSize: 18,
  },
  controlsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  startButton: {
    backgroundColor: "#FF9F1C",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  pauseButton: {
    backgroundColor: "#808080",
    padding: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  resumeButton: {
    backgroundColor: "#FF9F1C",
    padding: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  endButton: {
    backgroundColor: "#FF5B5B",
    padding: 12,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HealthTracker;
