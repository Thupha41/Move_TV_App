// Health Services simulation for Wear OS
// Note: This is a simulation of the Health Services API for React Native
// In a real Wear OS application, you would use the actual Health Services APIs

// Health data types
export type HealthDataType =
  | "HEART_RATE_BPM"
  | "DISTANCE"
  | "CALORIES"
  | "STEPS"
  | "FLOORS";

// Exercise types
export type ExerciseType =
  | "RUNNING"
  | "WALKING"
  | "BIKING"
  | "WORKOUT"
  | "SWIMMING";

// Exercise status
export type ExerciseStatus = "PREPARING" | "ACTIVE" | "PAUSED" | "ENDED";

// Health data reading
export interface HealthDataReading {
  dataType: HealthDataType;
  value: number;
  timestamp: number;
}

// Exercise session interface
export interface ExerciseSession {
  id: string;
  type: ExerciseType;
  status: ExerciseStatus;
  startTime: number;
  endTime?: number;
  metrics: Record<HealthDataType, number>;
  duration: number;
}

// Mock health data generators
const generateHeartRate = (): number => {
  return Math.floor(70 + Math.random() * 40); // 70-110 bpm
};

const generateDistance = (previousValue: number = 0): number => {
  return previousValue + Math.random() * 0.01; // Small increment in km
};

const generateCalories = (previousValue: number = 0): number => {
  return previousValue + Math.random() * 0.2; // Slow increase in calories
};

const generateSteps = (previousValue: number = 0): number => {
  return previousValue + Math.floor(Math.random() * 5); // Steps increase
};

// Simulated exercise session
let currentExerciseSession: ExerciseSession | null = null;

// Start an exercise session
export const startExerciseSession = (
  type: ExerciseType
): Promise<ExerciseSession> => {
  return new Promise((resolve) => {
    const sessionId = `exercise-${Date.now()}`;

    currentExerciseSession = {
      id: sessionId,
      type,
      status: "PREPARING",
      startTime: Date.now(),
      metrics: {
        HEART_RATE_BPM: 0,
        DISTANCE: 0,
        CALORIES: 0,
        STEPS: 0,
        FLOORS: 0,
      },
      duration: 0,
    };

    // Simulate initialization delay
    setTimeout(() => {
      if (currentExerciseSession) {
        currentExerciseSession.status = "ACTIVE";
        resolve({ ...currentExerciseSession });
      }
    }, 1000);
  });
};

// Pause an exercise session
export const pauseExerciseSession = (): Promise<ExerciseSession | null> => {
  return new Promise((resolve) => {
    if (currentExerciseSession && currentExerciseSession.status === "ACTIVE") {
      currentExerciseSession.status = "PAUSED";
      resolve({ ...currentExerciseSession });
    } else {
      resolve(null);
    }
  });
};

// Resume an exercise session
export const resumeExerciseSession = (): Promise<ExerciseSession | null> => {
  return new Promise((resolve) => {
    if (currentExerciseSession && currentExerciseSession.status === "PAUSED") {
      currentExerciseSession.status = "ACTIVE";
      resolve({ ...currentExerciseSession });
    } else {
      resolve(null);
    }
  });
};

// End an exercise session
export const endExerciseSession = (): Promise<ExerciseSession | null> => {
  return new Promise((resolve) => {
    if (currentExerciseSession) {
      currentExerciseSession.status = "ENDED";
      currentExerciseSession.endTime = Date.now();
      const finalSession = { ...currentExerciseSession };
      currentExerciseSession = null;
      resolve(finalSession);
    } else {
      resolve(null);
    }
  });
};

// Get the current exercise session
export const getCurrentExerciseSession =
  (): Promise<ExerciseSession | null> => {
    return Promise.resolve(
      currentExerciseSession ? { ...currentExerciseSession } : null
    );
  };

// Update metrics for the current session
export const updateExerciseMetrics = (): Promise<Record<
  HealthDataType,
  number
> | null> => {
  return new Promise((resolve) => {
    if (currentExerciseSession && currentExerciseSession.status === "ACTIVE") {
      currentExerciseSession.metrics = {
        HEART_RATE_BPM: generateHeartRate(),
        DISTANCE: generateDistance(currentExerciseSession.metrics["DISTANCE"]),
        CALORIES: generateCalories(currentExerciseSession.metrics["CALORIES"]),
        STEPS: generateSteps(currentExerciseSession.metrics["STEPS"]),
        FLOORS: Math.floor(currentExerciseSession.metrics["STEPS"] / 20),
      };

      // Update duration
      currentExerciseSession.duration =
        Date.now() - currentExerciseSession.startTime;

      resolve({ ...currentExerciseSession.metrics });
    } else {
      resolve(null);
    }
  });
};

// Check if Health Services are available
export const isHealthServicesAvailable = (): Promise<boolean> => {
  // In a real app, this would check if the platform supports Health Services
  return Promise.resolve(true);
};

// Get list of supported exercise types
export const getSupportedExerciseTypes = (): Promise<ExerciseType[]> => {
  return Promise.resolve([
    "RUNNING",
    "WALKING",
    "BIKING",
    "WORKOUT",
    "SWIMMING",
  ]);
};
