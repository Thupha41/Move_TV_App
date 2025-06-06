# Health Tracker App

A React Native application that simulates a Wear OS health tracker app with exercise tracking functionality.

## Features

- **Fitness Tracker**: Mimics a smartwatch interface with real-time exercise tracking
- **Health Metrics**: Displays heart rate, calories burned, distance, and step count
- **Exercise History**: View previous workouts with detailed metrics
- **Dictionary Feature**: Included from the original app

## Screenshots

The app includes multiple screens:

- Workout interface that mimics a Wear OS watch face
- Exercise History showing past workouts
- Dictionary feature (from the original app)

## How to Use

1. **Start the App**:

   ```
   npm start
   ```

2. **Navigate between Screens**:

   - Use the tab bar at the bottom to switch between Dictionary, Workout, and History screens

3. **Using the Workout Screen**:

   - Tap START to begin a workout
   - The display will show real-time metrics (heart rate, calories, distance, steps)
   - Tap PAUSE to pause your workout
   - Tap END to stop and save your workout

4. **View Exercise History**:
   - Navigate to the History tab to see your past workouts

## Implementation Details

This app demonstrates:

- React Native UI components styled to mimic a Wear OS device
- Custom animations and transitions
- State management for exercise tracking
- Simulated health metrics updates

## Notes

This is a simulation of the Wear OS Health Services API. In a real Wear OS application, you would use the actual Health Services APIs as described in the Android documentation:
https://developer.android.com/training/wearables/health-services

## Technologies Used

- React Native
- Expo
- TypeScript
